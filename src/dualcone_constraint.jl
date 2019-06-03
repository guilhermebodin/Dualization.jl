function add_dualcone_cosntraint!(dualmodel::MOI.ModelLike, vi::VI,
                                  ::Type{SAF{T}}, ::Type{MOI.GreaterThan{T}}) where T
    return MOI.add_constraint(dualmodel, SVF(vi), MOI.GreaterThan(0.0))
end

function add_dualcone_cosntraint!(dualmodel::MOI.ModelLike, vi::VI,
                                  ::Type{SAF{T}}, ::Type{MOI.LessThan{T}}) where T
    return MOI.add_constraint(dualmodel, SVF(vi), MOI.LessThan(0.0))
end

function add_dualcone_cosntraint!(dualmodel::MOI.ModelLike, vi::VI,
                                  ::Type{SAF{T}}, ::Type{MOI.Equalto{T}}) where T
    return # No constraint
end
