//import * as BoltSizeList  from '@/data/STL_BoltSize'
//import * as BoltGradeList  from '@/data/STL_BoltGrade'
//import * as AnchorGradeList  from '@/data/STL_AnchorGrade'
//import {map} from 'lodash'


export const steel =  {
    data(){
        return{
            methodList : ['ASD','LRFD'],
            method : 'ASD',
            E : 29000,
            axisList : ['Strong','Weak'],
            axis : 'Strong',
            //BOLT
            boltSizeList :['1/2','5/8','3/4','7/8','1','1 1/8','1 1/4', '1 3/8', '1 1/2'],
            boltSize : '3/4',
            boltGradeList : ['A307','A325N','A325X','A490N','A490X'],
            boltGrade : 'A325N',
            //ANCHOR ROD
            anchorSizeList : ['1/2','5/8','3/4','7/8','1','1 1/8','1 1/4', '1 1/2'],
            anchorSize : '3/4',
            anchorGradeList : ['F1554 GR 36-X','F1554 GR 36-N','F1554 GR 55-X','F1554 GR 55-N','F1554 GR 105-X','F1554 GR 105-N'],
            anchorGrade : 'F1554 GR 36-X',
        }//RETURN
    },//DATA
    created(){
        //this.boltSizeList = map(BoltSizeList.List,"Size")
        //this.boltGradeList = map(BoltGradeList.List,"Grade")
        //this.anchorGradeList = map(AnchorGradeList.List,"Grade")
        //this.anchorGradeData = AnchorGradeList.List
       
    },//CREATED
    computed:{
       
    },//COMPUTED
    methods:{
       
    }//METHODS
}//EXPORT