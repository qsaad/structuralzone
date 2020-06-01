import {concat, range, forEach, zipWith, split, map, toNumber, findIndex, last, first} from 'lodash'

export default class CantileverBeam {
    constructor({ L=20, E=29000, I=100, w=1,P="",a=""}){
        this.L = L
        this.E = E
        this.I = I
        this.w = w
        this.P = P

        //POINT LOAD
        this.P = P  //POINT LOAD STRING
        this.a = a  //POINT LOAD DISTANCES STRING

        this.inc = 0.25
        
    }//CONSTRUCTOR

    Lx(){
        let arr = concat(range(0, this.L, this.inc),this.L)

        return map(arr, x => x)
    }

    //POINT LOAD - CONVERT STRING TO ARRAY
    PL(){
        let P = map(split(this.P,','), (x) => toNumber(x))
        let a = map(split(this.a,','), (x) => toNumber(x))

        return zipWith(P, a,(P,a)=>{
            return {P:P,a:a}
        })
    }

    //LOADING DIAGRAM
    plotL(){
        return map(this.PL(), (item)=>{
            return {x:item.a,y:item.P}
        })
    }

    //---------------------------------------------------
    //REACTION
    //---------------------------------------------------
    RR(){
        let Ri = 0
        let w = this.w
        let L = this.L
        
        Ri = w*L
        forEach(this.PL(), (Pi,j)=>{
            let P = Pi.P
            Ri =  Ri + P
        }) 
        return Ri
    }//RR



    //---------------------------------------------------
    //SHEAR
    //---------------------------------------------------
    
    Vx(){
        let V = []
        let Vi = 0
        let w = this.w
        let L = this.L

        forEach(this.Lx(), (x,i) =>{
            Vi = -w*x
            forEach(this.PL(), (Pi,j)=>{
                let P = Pi.P
                let a = Pi.a
                if(x <= a){
                    Vi = Vi 
                }//IF
                else{
                    Vi = Vi - P
                }//ELSE
            })//P LOOP
            //V.push(Vi.toFixed(4))
            V.push(Vi)
        })//X LOOP

        return V
    }

    Vmax(){
        let arr = this.Vx()
        return last(arr)
    }

   

    plotV(){
        return zipWith(this.Lx(), this.Vx(),(x,V)=>{
            return {x:x,y:V}
        })
    }

    //---------------------------------------------------
    //FLEXURE
    //---------------------------------------------------
    Mx(){
        let M = []
        let Mi = 0
        let w = this.w
        let L = this.L
       
        forEach(this.Lx(), (x,i) =>{
            Mi = - w*Math.pow(x,2)/2
            forEach(this.PL(), (Pi,j)=>{
                let P = Pi.P
                let a = Pi.a
                
                if(x <= a){
                    Mi = Mi 
                }//IF
                else{
                    Mi = Mi - P*(x-a)
                }//ELSE
            })//P LOOP
            //M.push(Mi.toFixed(4))
            M.push(Mi)
        })//X LOOP

        return M
    }

    //MAXIMUM MOMENT
    Mmax(){
        let arr = this.Mx()
        return last(arr)
    }

    //DISTANCE FROM LEFT SUPPORT TO MAXIMUM MOMENT
    xm(){
        let index = findIndex(this.Mx(), (x) => x == this.Mmax())
        let arr = this.Lx()

        return arr[index]
    }

    //FLEXURE PLOT COORDINATE (X,M)
    plotM(){
        return zipWith(this.Lx(), this.Mx(),(x,M)=>{
            return {x:x,y:M}
        })
    }
     //---------------------------------------------------
    //DEFLECTION
    //---------------------------------------------------
   
    Dx(){
        let D = []
        let Di = 0
        let w = this.w
        let L = this.L
        let E = this.E
        let I = this.I

        forEach(this.Lx(), (x,i) =>{
            Di = w*1728*(Math.pow(x,4)-4*Math.pow(L,3)*x+3*Math.pow(L,4))/(24*E*I)
            
            forEach(this.PL(), (Pi,j)=>{
                let P = Pi.P
                let a = Pi.a
                let b = L - a
                if(x <= a){
                    Di =  Di + (P*Math.pow(b,2)*1728*(3*L-3*x-b))/(6*E*I)
                }//IF
                else{
                    Di =  Di + (P*Math.pow(L-x,2)*1728*(3*b-L+x))/(6*E*I)
                }//ELSE
            })//P LOOP
            //D.push(Di.toFixed(4))
            D.push(Di)
        })//X LOOP

        return D
    }

    //MAXIMUM DEFLECTION
    Dmax(){
        let arr = this.Dx()
        return first(arr)
    }

    //DISTANCE FROM LEFT SUPPORT TO MAXIMUM MOMENT
    xd(){
        let index = findIndex(this.Dx(), (x) => x == this.Dmax())
        let arr = this.Lx()

        return arr[index]
    }

    //DEFLECTION PLOT COORDINATE (X,D)
    plotD(){
        return zipWith(this.Lx(), this.Dx(),(x,D)=>{
            return {x:x,y:D}
        })
    }

    //---------------------------------------------------
    //PARAMETERS
    //---------------------------------------------------
    lengthParams(){
        return{
            inc : this.inc,
            Lx : this.Lx(),
            //Vp : this.plotV()
        }
    }
    shearParams(){
        return{
            xv : this.xm(),
            Vx : this.Vx(),
            //Vp : this.plotV()
        }
    }
    flexureParams(){
        return{
            xm : this.xm(),
            Mx : this.Mx(),
            //Mp : this.plotM()
        }
    }
    deflectionParams(){
        return{
            xd : this.xd(),
            Dx : this.Dx(),
            //Dp : this.plotD()
        }
    }


}//CLASS