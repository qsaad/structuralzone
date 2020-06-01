// export const List =[
//     {
//         "Grade":"A307",
//         "Fnt":45,
//         "Fnv":25
//     },
//     {
//         "Grade":"A325N",
//         "Fnt":90,
//         "Fnv":48
//     },
//     {
//         "Grade":"A325X",
//         "Fnt":90,
//         "Fnv":60
//     },
//     {
//         "Grade":"A490N",
//         "Fnt":113,
//         "Fnv":60
//     },
//     {
//         "Grade":"A490X",
//         "Fnt":113,
//         "Fnv":75
//     }
// ]


export function boltGrade(grade){
    switch (grade){
        case 'A307':
            return {Fnt : 45, Fnv : 25}
            break
        case 'A325N':
            return {Fnt : 90, Fnv : 48}
            break
        case 'A325X':
            return {Fnt : 90, Fnv : 60}
            break
        case 'A490N':
                return {Fnt : 113, Fnv : 60}
                break
        case 'A490X':
            return {Fnt : 113, Fnv : 75}
            break
    }//SWITCH
}//EXPORT DEFAULT