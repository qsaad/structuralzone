import {concat, range, forEach, zipWith, split, map, toNumber, findIndex} from 'lodash'

export default class SimpleBeam {
    constructor({ L=20, E=29000, I=100, w=1, P="",a=""}){
        this.L = L
        this.E = E
        this.I = I
        this.w = w  //UNIFORM LOAD
        
        //POINT LOAD
        this.P = P  //POINT LOAD STRING
        this.a = a  //POINT LOAD DISTANCES STRING

        this.inc = 0.25
    }

    Lx(){
        let arr = concat(range(0, this.L, this.inc),this.L)

        return map(arr, x => x.toFixed(4))
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
    RL(){
        let Ri = 0
        let w = this.w
        let L = this.L

        Ri = w*L/2
        forEach(this.PL(), (Pi,j)=>{
            let P = Pi.P
            let a = Pi.a
            let b = L - Pi.a
            Ri =  Ri + P*b/L
        }) 
        return Ri
    }//RR


    RR(){
        let Ri = 0
        let w = this.w
        let L = this.L

        Ri = w*L/2
        forEach(this.PL(), (Pi,j)=>{
            let P = Pi.P
            let a = Pi.a
            Ri =  Ri + P*a/L
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
            Vi = w * (L/2 - x)
            forEach(this.PL(), (Pi,j)=>{
                let P = Pi.P
                let a = Pi.a
                let b = L - a
               
                if(x <= a){
                    Vi =  Vi + P*b/L
                }//IF
                else{
                    Vi =  Vi + P*b/L - P
                }//ELSE
            })//P LOOP
            V.push(Vi)
        })//X LOOP

        return V
    }

    Vmax(){
        let V = map(this.Vx(), (x)=> Math.abs(x))
        return Math.max(...V)
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
        let L = this.L
       
        forEach(this.Lx(), (x,i) =>{
            Mi = this.w * x / 2 *(L - x)
            forEach(this.PL(), (Pi,j)=>{
                let P = Pi.P
                let a = Pi.a
                let b = L - a
                
                if(x <= a){
                    Mi =  Mi + P*b*x/L
                }//IF
                else{
                    Mi =  Mi + P*b*x/L - P*(x-a)
                }//ELSE
            })//P LOOP
            M.push(Mi)
        })//X LOOP

        return M
    }

    //MAXIMUM MOMENT
    Mmax(){
        return Math.max(...this.Mx())
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
        let L = this.L
        let w = this.w
        let E = this.E
        let I = this.I

        forEach(this.Lx(), (x,i) =>{
            Di = (w*x*(L-x)*(Math.pow(L,2) + x*(L-x))*1728)/(24*E*I*L)
            
            forEach(this.PL(), (Pi,j)=>{
                let P = Pi.P
                let a = Pi.a
                let b = L - a
                if(x <= a){
                    Di =  Di + (P*b*x*1728)/(6*E*I*L)*(Math.pow(L,2)-Math.pow(b,2)-Math.pow(x,2))
                }//IF
                else{
                    Di =  Di + (P*a*(L-x)*1728)/(6*E*I*L)*(2*L*x - Math.pow(x,2) - Math.pow(a,2))
                }//ELSE
            })//P LOOP
            D.push(Di)
        })//X LOOP

        return D
    }

    //MAXIMUM DEFLECTION
    Dmax(){
        return Math.max(...this.Dx())
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