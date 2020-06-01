export const PagesList = [
    //ANALYSIS
    {active:true, category:'analysis',image:'icons/beam.svg',title:'Analysis', link:'/analysis', description:'Strucutral Analysis', reference:'Strength of Materials'},
    {active:true, category:'analysis',image:'icons/simplebeam.svg',title:'Cantilever Beam', link:'/analysis/cantileverBeam', description:'Cantilever beam Moment, shear, reactions and deflection computation', reference:'AISC Manual'},
    {active:true, category:'analysis',image:'icons/simplebeam.svg',title:'Propped Beam', link:'/analysis/proppedBeam', description:'Propped beam Moment, shear, reactions and deflection computation', reference:'AISC Manual'},
    {active:true, category:'analysis',image:'icons/simplebeam.svg',title:'Simple Beam', link:'/analysis/simpleBeam', description:'Simple beam Moment, shear, reactions and deflection computation', reference:'AISC Manual'},
    {active:true, category:'analysis',image:'icons/simplebeam.svg',title:'Fixed Beam', link:'/analysis/fixedBeam', description:'Fixed beam Moment, shear, reactions and deflection computation', reference:'AISC Manual'},
    {active:true, category:'analysis',image:'icons/simplebeam.svg',title:'Single Overhang Beam', link:'/analysis/singleOverhangBeam', description:'Single Overhang beam Moment, shear, reactions and deflection computation', reference:'AISC Manual'},
    {active:true, category:'analysis',image:'icons/simplebeam.svg',title:'Double Overhang Beam', link:'/analysis/doubleOverhangBeam', description:'Double Overhang beam Moment, shear, reactions and deflection computation', reference:'AISC Manual'},
    {active:true, category:'analysis',image:'icons/basepressure.svg',title:'Base Pressure', link:'/analysis/basePressure', description:'Base pressure due to Axial and Moment', reference:'AISC Manual'},
    //COLDFORM
    {active:true, category:'coldform',image:'icons/coldform.svg',title:'Coldform', link:'/coldform', description:'Coldform Design', reference:'AISI Manual'},
    //CONCRETE
    {active:true, category:'concrete',image:'icons/concrete.svg',title:'Concrete', link:'/concrete', description:'Concrete Design', reference:'ACI 314'},
    {active:true, category:'concrete',image:'icons/concrete.svg',title:'Concrete Beam Capacity', link:'/concrete/beamCapacity', description:'Flexure and Shear Capacity of Concrete Beam ', reference:'ACI 314'},
    {active:true, category:'concrete',image:'icons/concrete.svg',title:'Rebar Development Length', link:'/concrete/developmentLength', description:'Rebar Development Length', reference:'ACI 314'},
    {active:true, category:'concrete',image:'icons/concrete.svg',title:'Embed Plate', link:'/concrete/embedPlate', description:'Embed plate with headed studs design', reference:'PCI 314'},
    //FOUNDATION
    {active:true, category:'foundation',image:'icons/foundation.svg',title:'Foundation', link:'/foundation', description:'Foundation Design', reference:'ACI 314'},
    {active:true, category:'foundation',image:'icons/foundation.svg',title:'Concrete Retaining Wall', link:'/foundation/retainingWall', description:'Retaining wall analysis and design', reference:'ACI 314'},
    {active:true, category:'foundation',image:'icons/foundation.svg',title:'Spread Footing', link:'/foundation/spreadFooting', description:'Spread Footing analysis and design', reference:'ACI 314'},
    //MASONRY
    {active:true, category:'masonry',image:'icons/masonry.svg',title:'Masonry', link:'/masonry', description:'Masonry Design', reference:'ACI 318'},
    {active:true, category:'masonry',image:'icons/masonry.svg',title:'Masonry Section Properties', link:'/masonry/sectionProperties', description:'Masonry Section Properties', reference:'ACI 318'},
    {active:true, category:'masonry',image:'icons/masonry.svg',title:'Masonry Section Capacity', link:'/masonry/sectionCapacity', description:'Masonry Section Flexure, Axial and Shear capacity', reference:'ACI 318'},
    {active:true, category:'masonry',image:'icons/masonry.svg',title:'Masonry Bearing Wall', link:'/masonry/wallCapacity', description:'Masonry Member Design', reference:'ACI 318'},
    //SEISMIC
    {active:true, category:'seismic',image:'icons/seismic.svg',title:'Seismic', link:'/seismic', description:'Seismic Design', reference:'AISC 340'},
    {active:true, category:'seismic',image:'icons/seismic.svg',title:'Seismic Base Shear', link:'/seismic/baseShear', description:'Seismic Base Shear', reference:'AISC 340'},
    {active:true, category:'seismic',image:'icons/seismic.svg',title:'Seismic Component Force', link:'/seismic/componentForce', description:'Seismic Component Force', reference:'AISC 340'},
    //SNOW
    {active:true, category:'snow',image:'icons/snow.svg',title:'Snow', link:'/snow', description:'Snow Loads', reference:'ASCE 7-10'},
    {active:true, category:'snow',image:'icons/snow.svg',title:'Flat Roof Snow', link:'/snow/flat', description:'Flat roof Loads', reference:'ASCE 7-10'},
    {active:true, category:'snow',image:'icons/snow.svg',title:'Sloped Roof Snow', link:'/snow/sloped', description:'Sloped roof Loads', reference:'ASCE 7-10'},
    {active:true, category:'snow',image:'icons/snow.svg',title:'Drift Snow', link:'/snow/drift', description:'Drift Snow Loads', reference:'ASCE 7-10'},
    {active:true, category:'snow',image:'icons/snow.svg',title:'Unbalanced Snow', link:'/snow/unbalanced', description:'Unbalanced Snow Loads', reference:'ASCE 7-10'},
    //STEEL
    {active:true, category:'steel',image:'icons/steel.svg',title:'Steel', link:'/steel', description:'Steel Design', reference:'AISC Manual'},
    {active:true, category:'steel',image:'icons/steel.svg',title:'Steel Section Properties', link:'/steel/sectionProperties', description:'Steel Member Section Properties', reference:'AISC Manual'},
    {active:true, category:'steel',image:'icons/steel.svg',title:'Steel Section Capacity', link:'/steel/sectionCapacity', description:'Steel Section Axial, Flexure, Shear and Torsion capacity', reference:'AISC Manual'},
    {active:true, category:'steel',image:'icons/steel.svg',title:'Steel Beam', link:'/steel/beam', description:'Steel Beam Design', reference:'AISC Manual'},
    {active:true, category:'steel',image:'icons/steel.svg',title:'Steel Lintel', link:'/steel/lintel', description:'Steel Lintel Design', reference:'AISC Manual'},
    {active:true, category:'steel',image:'icons/steel.svg',title:'Steel Base Plate', link:'/steel/basePlate', description:'Steel Base Plate', reference:'AISC Manual'},
    //WIND
    {active:true, category:'wind',image:'icons/wind.svg',title:'Wind', link:'/wind', description:'Wind Loads', reference:'ASCE 7-10'},
    {active:true, category:'wind',image:'icons/wind.svg',title:'Wind Pressure', link:'/wind/windPressure', description:'Wind Loads', reference:'ASCE 7-10'},
    //WOOD
    {active:true, category:'wood',image:'icons/wood.svg',title:'Wood', link:'/wood', description:'Wood Design', reference:'NDS 2015'},
    {active:true, category:'wood',image:'icons/wood.svg',title:'Wood Section Properties', link:'/wood/sectionProperties', description:'Wood Stress Properties', reference:'NDS 2015'},
    {active:true, category:'wood',image:'icons/wood.svg',title:'Wood Section Capacity', link:'/wood/sectionCapacity', description:'Wood Section Axial, Flexure, Shear and Torsion capacity', reference:'NDS 2015'},
    {active:true, category:'wood',image:'icons/wood.svg',title:'Wood Fastener Capacity', link:'/wood/fastenerCapacity', description:'Nail, Wood screw, Lag screw or Bolt Capacity', reference:'NDS 2015'},
    
   
]

