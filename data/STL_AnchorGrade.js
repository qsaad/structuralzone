// export const List =[
//     {
//         Grade :"F1554 GR 36-X",
//         Fu : 58,
//         Fnt : 43.5,
//         Fnv : 29,
//     },
//     {
//         Grade :"F1554 GR 36-N",
//         Fu : 58,
//         Fnt : 43.5,
//         Fnv : 23.2,
//     },
//     {
//         Grade :"F1554 GR 55-X",
//         Fu : 75,
//         Fnt : 56.3,
//         Fnv : 37.5,
//     },
//     {
//         Grade :"F1554 GR 55-N",
//         Fu : 75,
//         Fnt : 56.3,
//         Fnv : 30,
//     },
//     {
//         Grade :"F1554 GR 105-X",
//         Fu : 125,
//         Fnt : 93.8,
//         Fnv : 62.5,
//     },
//     {
//         Grade :"F1554 GR 105-N",
//         Fu : 125,
//         Fnt : 93.8,
//         Fnv : 50,
//     }
// ]

export function anchorGrade(grade){
    switch (grade){
        case 'F1554 GR 36-X':
            return {Fu : 58, Fnt : 43.5, Fnv : 29}
            break
        case 'F1554 GR 36-N':
            return {Fu : 58, Fnt : 43.5, Fnv : 23.2}
            break
        case 'F1554 GR 55-X':
            return {Fu : 75, Fnt : 56.3, Fnv : 37.5}
            break
        case 'F1554 GR 55-N':
                return {Fu : 75, Fnt : 56.3, Fnv : 30}
                break
        case 'F1554 GR 105-X':
            return {Fu : 125, Fnt : 93.8, Fnv : 62.5}
            break
        case 'F1554 GR 105-N':
            return {Fu : 125, Fnt : 93.8, Fnv : 50}
            break
    }//SWITCH
}//EXPORT DEFAULT