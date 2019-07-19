function add_dual_vars_in_dual_cones(dual_model::MOI.ModelLike, primal_model::MOI.ModelLike,
                                     primal_dual_map::PrimalDualMap,
                                     con_types::Vector{Tuple{DataType, DataType}}, T::DataType)
    dual_obj_affine_terms = Dict{VI, T}()
    for (F, S) in con_types
        primal_cis = MOI.get(primal_model, MOI.ListOfConstraintIndices{F,S}()) # Constraints of type {F, S}
        for ci in primal_cis
            # Add dual variable to dual cone
            # Fill a dual objective dictionary
            # Fill the primal_con_dual_var dictionary
            ci_dual = add_dual_variable(dual_model, primal_model, 
                                        primal_dual_map.primal_con_dual_var, dual_obj_affine_terms, ci)
            push!(primal_dual_map.primal_con_dual_con, ci => ci_dual)
            push_to_dual_con_primal_con!(primal_dual_map.dual_con_primal_con, ci_dual, ci)
            push!(primal_dual_map.primal_con_constants, ci => get_scalar_term(primal_model, ci, T))
        end
    end
    return dual_obj_affine_terms
end

# Utils for add_dual_variable functions
function push_to_dual_obj_aff_terms!(dual_obj_affine_terms::Dict{VI, T}, vi::VI, value::T) where T
    if !iszero(value) # If value is different than 0 add to the dictionary
        push!(dual_obj_affine_terms, vi => value)
    end
    return 
end

# Utils for add_dual_variable functions
function push_to_dual_con_primal_con!(dual_con_primal_con::Dict{CI, CI}, ci_dual::CI, ci_primal::CI)
    return push!(dual_con_primal_con, ci_dual => ci_primal)
end

function push_to_dual_con_primal_con!(dual_con_primal_con::Dict{CI, CI}, ci_dual::Nothing, ci_primal::CI)
    return 
end

function _add_dual_variable(dual_model::MOI.ModelLike, primal_model::MOI.ModelLike,
                            primal_con_dual_var::Dict{CI, Vector{VI}}, dual_obj_affine_terms::Dict{VI, T},
                            ci::CI{F, S}) where {T, F <: MOI.AbstractFunction, 
                                                    S <: MOI.AbstractSet}

    row_dimension = get_ci_row_dimension(primal_model, ci) 
    vis = MOI.add_variables(dual_model, row_dimension) # Add as many variables as the dimension of the constraint
    push!(primal_con_dual_var, ci => vis) # Add the map of the added dual variable to the relationated constraint
    # Add each vi to the dictionary
    for (i, vi) in enumerate(vis)
        push_to_dual_obj_aff_terms!(dual_obj_affine_terms, vi, get_scalar_term(primal_model, ci, T)[i])
    end
    return vis
end


function add_dual_variable(dual_model::MOI.ModelLike, primal_model::MOI.ModelLike,
                           primal_con_dual_var::Dict{CI, Vector{VI}}, dual_obj_affine_terms::Dict{VI, T},
                           ci::CI{F, S}) where {T, F <: MOI.AbstractFunction, 
                                                   S <: MOI.AbstractSet}
                                 
    vis = _add_dual_variable(dual_model, primal_model, primal_con_dual_var, 
                             dual_obj_affine_terms, ci)
    return add_dual_cone_constraint(dual_model, primal_model, vis, ci)
end