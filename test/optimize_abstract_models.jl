"""
Attach an AbstractModel{T} to an optimizer, 
solve it and retrieve the termination status and objective value
"""
function solve_abstract_model(model::MOIU.AbstractModel{T}, factory::OptimizerFactory) where T
    JuMP_model = JuMP.Model()
    MOI.copy_to(JuMP.backend(JuMP_model), model)
    set_optimizer(JuMP_model, factory)
    optimize!(JuMP_model)
    termination_status = JuMP.termination_status(JuMP_model)
    obj_val = JuMP.objective_value(JuMP_model)
    return termination_status, obj_val
end

"""
Test if strong duality holds for a problem
"""
function test_strong_duality(primal_model::MOIU.AbstractModel{T}, 
                             dual_model::MOIU.AbstractModel{T}, factory::OptimizerFactory) where T

    primal_term_status, primal_obj_val = solve_abstract_model(primal_model, factory)
    dual_term_status, dual_obj_val = solve_abstract_model(dual_model, factory)

    if primal_term_status == dual_term_status == MOI.OPTIMAL
        return primal_obj_val == dual_obj_val
    elseif (primal_term_status == MOI.INFEASIBLE) && (dual_term_status == MOI.DUAL_INFEASIBLE)
        return true
    elseif (primal_term_status == MOI.DUAL_INFEASIBLE) && (dual_term_status == MOI.INFEASIBLE)
        return true
    elseif (primal_term_status == MOI.DUAL_INFEASIBLE) && (dual_term_status == MOI.INFEASIBLE_OR_UNBOUNDED)
        return true
    elseif (primal_term_status == MOI.INFEASIBLE_OR_UNBOUNDED) && (dual_term_status == MOI.DUAL_INFEASIBLE)
        return true
    end
    return false # In case strong duality doesn't hold
end

function test_strong_duality(primal_problems::Array{Function}, factory::OptimizerFactory)
    for primal_problem in primal_problems
        dual_problem = dualize(primal_problem()).dual_model
        @test test_strong_duality(primal_problem(), dual_problem, factory)
    end
end