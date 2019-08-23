var documenterSearchIndex = {"docs":
[{"location":"examples/#Examples-1","page":"Examples","title":"Examples","text":"","category":"section"},{"location":"examples/#","page":"Examples","title":"Examples","text":"Here we discuss some useful examples of usage.","category":"page"},{"location":"examples/#Dualize-a-JuMP-model-1","page":"Examples","title":"Dualize a JuMP model","text":"","category":"section"},{"location":"examples/#","page":"Examples","title":"Examples","text":"Let us dualize the following Second Order Cone program","category":"page"},{"location":"examples/#","page":"Examples","title":"Examples","text":"beginalign\n     min_x y z  y + z \n    \n     textst\n    x  = 1\n     x  = 1\n    x  geq (yz)_2\nendalign","category":"page"},{"location":"examples/#","page":"Examples","title":"Examples","text":"The corresponding code in JuMP is","category":"page"},{"location":"examples/#","page":"Examples","title":"Examples","text":"using JuMP, Dualization\nmodel = Model()\n@variable(model, x)\n@variable(model, y)\n@variable(model, z)\n@constraint(model, soccon, [x; y; z] in SecondOrderCone())\n@constraint(model, eqcon, x == 1)\n@objective(model, Min, y + z)","category":"page"},{"location":"examples/#","page":"Examples","title":"Examples","text":"You can dualize the model by doing","category":"page"},{"location":"examples/#","page":"Examples","title":"Examples","text":"dual_model = dualize(model)","category":"page"},{"location":"examples/#","page":"Examples","title":"Examples","text":"And you should get the model","category":"page"},{"location":"examples/#","page":"Examples","title":"Examples","text":"beginalign\n     max_eqcon soccon  eqcon \n    \n     textst\n    eqcon + soccon_1  = 0\n     soccon_2  = 1\n     soccon_3  = 1\n    soccon_1  geq (soccon_2soccon_3)_2\nendalign","category":"page"},{"location":"examples/#","page":"Examples","title":"Examples","text":"Note that if you declare the model with an optimizer attached you will lose the optimizer during the dualization.  To dualize the model and attach the optimizer to the dual model you should do dualize(dual_model; with_optimizer(...))","category":"page"},{"location":"examples/#","page":"Examples","title":"Examples","text":"using JuMP, Dualization, ECOS\nmodel = Model(with_optimizer(ECOS.Optimizer))\n@variable(model, x)\n@variable(model, y)\n@variable(model, z)\n@constraint(model, soccon, [x; y; z] in SecondOrderCone())\n@constraint(model, eqcon, x == 1)\n@objective(model, Min, y + z)\n\ndual_model = dualize(model, with_optimizer(ECOS.Optimizer))","category":"page"},{"location":"examples/#Naming-the-dual-variables-and-dual-constraints-1","page":"Examples","title":"Naming the dual variables and dual constraints","text":"","category":"section"},{"location":"examples/#","page":"Examples","title":"Examples","text":"You can provide prefixes for the name of the variables and the name of the constraints using the a DualNames variable. Everytime you use the dualize function you can provide a DualNames as keyword argument. Consider the following example.","category":"page"},{"location":"examples/#","page":"Examples","title":"Examples","text":"You want to dualize this JuMP problem and add a prefix to the name of each constraint to be more clear on what the variables  represent. For instance you want to put \"dual\" before the name of the constraint.","category":"page"},{"location":"examples/#","page":"Examples","title":"Examples","text":"using JuMP, Dualization\nmodel = Model()\n@variable(model, x)\n@variable(model, y)\n@variable(model, z)\n@constraint(model, soccon, [x; y; z] in SecondOrderCone())\n@constraint(model, eqcon, x == 1)\n@objective(model, Min, y + z)\n\n# The first field of DualNames is the prefix of the dual variables\n# and the second field is the prefix of the dual constraint\ndual_model = dualize(model; dual_names = DualNames(\"dual\", \"\"))","category":"page"},{"location":"examples/#","page":"Examples","title":"Examples","text":"The dual_model will be registered as ","category":"page"},{"location":"examples/#","page":"Examples","title":"Examples","text":"beginalign\n     max_dualeqcon dualsoccon  dualeqcon \n    \n     textst\n    dualeqcon + dualsoccon_1  = 0\n     dualsoccon_2  = 1\n     dualsoccon_3  = 1\n    dualsoccon_1  geq (dualsoccon_2 dualsoccon_3)_2\nendalign","category":"page"},{"location":"examples/#Solving-a-problem-using-its-dual-formulation-1","page":"Examples","title":"Solving a problem using its dual formulation","text":"","category":"section"},{"location":"examples/#","page":"Examples","title":"Examples","text":"Depending on the solver and on the type of formulation, solving the dual problem could be faster than solving the primal. To solve the problem via its dual formulation can be done using the DualOptimizer.","category":"page"},{"location":"examples/#","page":"Examples","title":"Examples","text":"using JuMP, Dualization, ECOS\n\n# Solving a problem the standard way\nmodel = Model(with_optimizer(ECOS.Optimizer))\n@variable(model, x)\n@variable(model, y)\n@variable(model, z)\n@constraint(model, soccon, [x; y; z] in SecondOrderCone())\n@constraint(model, eqcon, x == 1)\n@objective(model, Min, y + z)\n\n# Solving a problem by providing its dual representation\nmodel = Model(with_optimizer(DualOptimizer, ECOS.Optimizer()))\n@variable(model, x)\n@variable(model, y)\n@variable(model, z)\n@constraint(model, soccon, [x; y; z] in SecondOrderCone())\n@constraint(model, eqcon, x == 1)\n@objective(model, Min, y + z)\n\n# You can pass arguments to the solver by putting them as arguments inside the solver `Optimizer`\nmodel = Model(with_optimizer(DualOptimizer, ECOS.Optimizer(maxit = 5)))\n@variable(model, x)\n@variable(model, y)\n@variable(model, z)\n@constraint(model, soccon, [x; y; z] in SecondOrderCone())\n@constraint(model, eqcon, x == 1)\n@objective(model, Min, y + z)","category":"page"},{"location":"manual/#Manual-1","page":"Manual","title":"Manual","text":"","category":"section"},{"location":"manual/#","page":"Manual","title":"Manual","text":"note: Note\nThis package only works for optimization models that can be written in the conic-form.","category":"page"},{"location":"manual/#Conic-Duality-1","page":"Manual","title":"Conic Duality","text":"","category":"section"},{"location":"manual/#","page":"Manual","title":"Manual","text":"Conic duality is the starting point for MOI's duality conventions. When all functions are affine (or coordinate projections), and all constraint sets are closed convex cones, the model may be called a conic optimization problem. For conic-form minimization problems, the primal is:","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"beginalign\n min_x in mathbbR^n  a_0^T x + b_0\n\n textst  A_i x + b_i  in mathcalC_i  i = 1 ldots m\nendalign","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"and the dual is:","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"beginalign\n max_y_1 ldots y_m  -sum_i=1^m b_i^T y_i + b_0\n\n textst  a_0 - sum_i=1^m A_i^T y_i  = 0\n\n  y_i  in mathcalC_i^*  i = 1 ldots m\nendalign","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"where each mathcalC_i is a closed convex cone and mathcalC_i^* is its dual cone.","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"For conic-form maximization problems, the primal is:","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"beginalign\n max_x in mathbbR^n  a_0^T x + b_0\n\n textst  A_i x + b_i  in mathcalC_i  i = 1 ldots m\nendalign","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"and the dual is:","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"beginalign\n min_y_1 ldots y_m  sum_i=1^m b_i^T y_i + b_0\n\n textst  a_0 + sum_i=1^m A_i^T y_i  = 0\n\n  y_i  in mathcalC_i^*  i = 1 ldots m\nendalign","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"A linear inequality constraint a^T x + b ge c should be interpreted as a^T x + b - c in mathbbR_+, and similarly a^T x + b le c should be interpreted as a^T x + b - c in mathbbR_-. Variable-wise constraints should be interpreted as affine constraints with the appropriate identity mapping in place of A_i.","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"For the special case of minimization LPs, the MOI primal form can be stated as","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"beginalign\n min_x in mathbbR^n  a_0^T x + b_0\n\n textst\nA_1 x  ge b_1\n A_2 x  le b_2\n A_3 x  = b_3\nendalign","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"By applying the stated transformations to conic form, taking the dual, and transforming back into linear inequality form, one obtains the following dual:","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"beginalign\n max_y_1y_2y_3  b_1^Ty_1 + b_2^Ty_2 + b_3^Ty_3 + b_0\n\n textst\nA_1^Ty_1 + A_2^Ty_2 + A_3^Ty_3  = a_0\n y_1 ge 0\n y_2 le 0\nendalign","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"For maximization LPs, the MOI primal form can be stated as:","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"beginalign\n max_x in mathbbR^n  a_0^T x + b_0\n\n textst\nA_1 x  ge b_1\n A_2 x  le b_2\n A_3 x  = b_3\nendalign","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"and similarly, the dual is:","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"beginalign\n min_y_1y_2y_3  -b_1^Ty_1 - b_2^Ty_2 - b_3^Ty_3 + b_0\n\n textst\nA_1^Ty_1 + A_2^Ty_2 + A_3^Ty_3  = -a_0\n y_1 ge 0\n y_2 le 0\nendalign","category":"page"},{"location":"manual/#Supported-constraints-1","page":"Manual","title":"Supported constraints","text":"","category":"section"},{"location":"manual/#","page":"Manual","title":"Manual","text":"This is the list of supported Function-in-Set constraints of the package. If you try to dualize a constraint not listed here, it will return an unsupported error.","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"MOI Function MOI Set\nSingleVariable GreaterThan\nSingleVariable LessThan\nSingleVariable EqualTo\nScalarAffineFunction GreaterThan\nScalarAffineFunction LessThan\nScalarAffineFunction EqualTo\nVectorOfVariables Nonnegatives\nVectorOfVariables Nonpositives\nVectorOfVariables Zeros\nVectorOfVariables SecondOrderCone\nVectorOfVariables RotatedSecondOrderCone\nVectorOfVariables PositiveSemidefiniteConeTriangle\nVectorOfVariables ExponentialCone\nVectorOfVariables DualExponentialCone\nVectorOfVariables PowerCone\nVectorOfVariables DualPowerCone\nVectorAffineFunction Nonnegatives\nVectorAffineFunction Nonpositives\nVectorAffineFunction Zeros\nVectorAffineFunction SecondOrderCone\nVectorAffineFunction RotatedSecondOrderCone\nVectorAffineFunction PositiveSemidefiniteConeTriangle\nVectorAffineFunction ExponentialCone\nVectorAffineFunction DualExponentialCone\nVectorAffineFunction PowerCone\nVectorAffineFunction DualPowerCone","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"Note that some of MOI constraints can be bridged, see Bridges, to constraints in this list.","category":"page"},{"location":"manual/#Supported-objective-functions-1","page":"Manual","title":"Supported objective functions","text":"","category":"section"},{"location":"manual/#","page":"Manual","title":"Manual","text":"MOI Function\nSingleVariable\nScalarAffineFunction","category":"page"},{"location":"manual/#Dualize-a-model-1","page":"Manual","title":"Dualize a model","text":"","category":"section"},{"location":"manual/#","page":"Manual","title":"Manual","text":"dualize","category":"page"},{"location":"manual/#Dualization.dualize","page":"Manual","title":"Dualization.dualize","text":"dualize(args...; kwargs...)\n\nThe dualize function works in three different ways. The user can provide:\n\nA MathOptInterface.ModelLike\n\nThe function will return a DualProblem struct that has the dualized model and PrimalDualMap{Float64} for users to identify the links between primal and dual model.\n\nA MathOptInterface.ModelLike and a DualProblem{T}\nA JuMP.Model\n\nThe function will return a JuMP model with the dual representation of the problem.\n\nA JuMP.Model and an optimizer factory\n\nThe function will return a JuMP model with the dual representation of the problem with  the OptimizerFactory attached. The OptimizerFactory is the solver and its key arguments that users provide in JuMP models, i.e. with_optimizer(GLPK.Optimizer).\n\nOn each of these methods, the user can provide the keyword argument dual_names. dual_names must be a DualNames struct. It allows users to set more intuitive names  for the dual variables and dual constraints created.\n\n\n\n\n\n","category":"function"},{"location":"manual/#DualOptimizer-1","page":"Manual","title":"DualOptimizer","text":"","category":"section"},{"location":"manual/#","page":"Manual","title":"Manual","text":"You can solve a primal problem by using its dual formulation using the DualOptimizer.","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"DualOptimizer","category":"page"},{"location":"manual/#Dualization.DualOptimizer","page":"Manual","title":"Dualization.DualOptimizer","text":"DualOptimizer(dual_optimizer::OT) where {OT <: MOI.ModelLike}\n\nThe DualOptimizer finds the solution for a problem solving its dual representation. It builds the dual model and solve it using the dual_optimizer as solver.\n\nThe user can define the model providing the DualOptimizer and the solver of its choice\n\njulia> using Dualization, JuMP, GLPK\n\njulia> model = Model(with_optimizer(DualOptimizer, GLPK.Optimizer()))\nA JuMP Model\nFeasibility problem with:\nVariables: 0\nModel mode: AUTOMATIC\nCachingOptimizer state: EMPTY_OPTIMIZER\nSolver name: Dual model with GLPK attached\n\n\n\n\n\n","category":"type"},{"location":"manual/#Adding-new-sets-1","page":"Manual","title":"Adding new sets","text":"","category":"section"},{"location":"manual/#","page":"Manual","title":"Manual","text":"Dualization.jl can automatically dualize models with custom sets. To do this, the user needs to define the set and its dual set and provide the functions:","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"supported_constraint\ndual_set ","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"If the custom set has some special scalar product (see the link), the user also needs to provide a set_dot function.","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"For example, let us define a fake cone and its dual, the fake dual cone. We will write a JuMP model with the fake cone and dualize it.","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"using Dualization, JuMP, MathOptInterface, LinearAlgebra\n\n# Rename MathOptInterface to simplify the code\nconst MOI = MathOptInterface\n\n# Define the custom cone and its dual\nstruct FakeCone <: MOI.AbstractVectorSet\n    dimension::Int\nend\n\nstruct FakeDualCone <: MOI.AbstractVectorSet\n    dimension::Int\nend\n\n# Define a model with your FakeCone\nmodel = Model()\n@variable(model, x[1:3])\n@constraint(model, con, x in FakeCone(3)) # Note that the constraint name is \"con\"\n@objective(model, Min, sum(x))","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"The resulting JuMP model is","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"beginalign\n     min_x  x_1 + x_2 + x_3 \n    \n     textst\n    x in FakeCone(3)\nendalign","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"Now in order to dualize we must overload the methods as described above.","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"# Overload the methods dual_set and supported_constraints\nDualization.dual_set(s::FakeCone) = FakeDualCone(MOI.dimension(s))\nDualization.supported_constraint(::Type{MOI.VectorOfVariables}, ::Type{<:FakeCone}) = true\n\n# If your set has some specific scalar product you also need to define a new set_dot function\n# Our FakeCone has this weird scalar product\nMOI.Utilities.set_dot(x::Vector, y::Vector, set::FakeCone) = 2dot(x, y)\n\n# Dualize the model\ndual_model = dualize(model)","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"The resulting dual model is ","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"beginalign\n     max_con  0 \n    \n     textst\n    2con_1  = 1\n    2con_2  = 1\n    2con_3  = 1\n     con  in FakeDualCone(3)\nendalign","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"If the model has constraints that are MOI.VectorAffineFunction","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"model = Model()\n@variable(model, x[1:3])\n@constraint(model, con, x + 3 in FakeCone(3))\n@objective(model, Min, sum(x))","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"beginalign\n     min_x  x_1 + x_2 + x_3 \n    \n     textst\n    x_1 + 3 x_2 + 3 x_3 + 3  in FakeCone(3)\nendalign","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"the user only needs to extend the supported_constraints function.","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"# Overload the supported_constraints for VectorAffineFunction\nDualization.supported_constraint(::Type{<:MOI.VectorAffineFunction}, ::Type{<:FakeCone}) = true\n\n# Dualize the model\ndual_model = dualize(model)","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"The resulting dual model is","category":"page"},{"location":"manual/#","page":"Manual","title":"Manual","text":"beginalign\n     max_con  - 3con_1 - 3con_2 - 3con_3 \n    \n     textst\n    2con_1  = 1\n    2con_2  = 1\n    2con_3  = 1\n     con  in FakeDualCone(3)\nendalign","category":"page"},{"location":"reference/#Reference-1","page":"Reference","title":"Reference","text":"","category":"section"},{"location":"reference/#","page":"Reference","title":"Reference","text":"Dualization.supported_constraints\nDualization.supported_objective\nDualization.set_dual_model_sense\nDualization.get_primal_objective\nDualization.get_dual_objective\nDualization.set_dual_objective\nDualization.PrimalObjective\nDualization.DualObjective\nDualization.DualNames\nDualization.dual_set","category":"page"},{"location":"reference/#Dualization.supported_constraints","page":"Reference","title":"Dualization.supported_constraints","text":"supported_constraints(con_types::Vector{Tuple{DataType, DataType}})\n\nReturns true if Function-in-Set is supported for Dualization and throws an error if it is not.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Dualization.supported_objective","page":"Reference","title":"Dualization.supported_objective","text":"supported_objective(primal_model::MOI.ModelLike)\n\nReturns true if MOI.ObjectiveFunctionType() is supported for Dualization and throws an error if it is not.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Dualization.set_dual_model_sense","page":"Reference","title":"Dualization.set_dual_model_sense","text":"set_dual_model_sense!(dual_model::MOI.ModelLike, model::MOI.ModelLike)\n\nSet the dual model objective sense.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Dualization.get_primal_objective","page":"Reference","title":"Dualization.get_primal_objective","text":"get_primal_obj_coeffs(model::MOI.ModelLike)\n\nGet the coefficients from the primal objective function and return a PrimalObjective{T}.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Dualization.get_dual_objective","page":"Reference","title":"Dualization.get_dual_objective","text":"get_dual_objective(dual_model::MOI.ModelLike, dual_obj_affine_terms::Dict,\n                   primal_objective::PrimalObjective{T})::DualObjective{T} where T\n\nbuild the dual model objective function from the primal model.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Dualization.set_dual_objective","page":"Reference","title":"Dualization.set_dual_objective","text":"set_dual_objective(dual_model::MOI.ModelLike, dual_objective::DualObjective{T})::Nothing where T\n\nAdd the objective function to the dual model.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Dualization.PrimalObjective","page":"Reference","title":"Dualization.PrimalObjective","text":"PrimalObjective{T}\n\nPrimal objective is defined as a MOI.ScalarAffineFunction\n\n\n\n\n\n","category":"type"},{"location":"reference/#Dualization.DualObjective","page":"Reference","title":"Dualization.DualObjective","text":"DualObjective{T}\n\nDual objective is defined as a MOI.ScalarAffineFunction.\n\n\n\n\n\n","category":"type"},{"location":"reference/#Dualization.DualNames","page":"Reference","title":"Dualization.DualNames","text":"DualNames\n\nDualNames is a struct to pass the prefix of dual variables and dual constraints names. See more on naming the variables.\n\n\n\n\n\n","category":"type"},{"location":"reference/#Dualization.dual_set","page":"Reference","title":"Dualization.dual_set","text":"dual_set(s::MOI.AbstractSet) -> MOI.AbstractSet\n\nReturns the dual set of s.\n\n\n\n\n\n","category":"function"},{"location":"#Dualization.jl-Documentation-1","page":"Home","title":"Dualization.jl Documentation","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Dualization.jl is a package written on top of MathOptInterface that allows users to write the dual of a JuMP model automatically. This package has two main features: the dualize function, which enables users to get a dualized JuMP model, and the DualOptimizer, which enables users to solve a problem by providing the solver the dual of the problem. ","category":"page"},{"location":"#Installation-1","page":"Home","title":"Installation","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"To install the package you can use Pkg.add it as follows:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"pkg> add Dualization","category":"page"},{"location":"#Contributing-1","page":"Home","title":"Contributing","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Contributions to this package are more than welcome, if you find a bug please post it on the github issue tracker.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"When contributing please note that the package follows the JuMP style guide","category":"page"}]
}