import {concat, range, forEach, zipWith, split, map, toNumber, findIndex, first, last, compact} from 'lodash'

export default class SingleOverhangBeam {
    constructor({ L1=1, L2=12, L3=1, Lo=1, E=29000, I=100, w=1, P="",a=""}){
        this.L1 = L1
        this.L2 = L2
        this.L3 = L3
        this.L = L1 + L2 + L3
        this.E = E
        this.I = I
        this.w = w  //UNIFORM LOAD
        
        //POINT LOAD
        this.P = P  //POINT LOAD STRING
        this.a = a  //POINT LOAD DISTANCES STRING

        this.inc = 0.25
    }

    Lx(){
        let arr1 = concat(range(0, this.L1 , this.inc),this.L1 )
        let arr2 = concat(range(this.L1, this.L1 + this.L2, this.inc),this.L1 + this.L2)
        let arr3 = concat(range(this.L1 + this.L2, this.L1 + this.L2 + this.L3, this.inc),this.L1 + this.L2 + this.L3)

        let arr = concat(arr1, arr2, arr3)

        return map(arr, x => x)

        //let arr = concat(range(0, this.L, this.inc),this.L)
        //return map(arr, x => x)
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
        let L1 = this.L1
        let L2 = this.L2
        let L3 = this.L3
        let L = this.L
        let w = this.w

        Ri = w*L*(L-2*L3)/(2*L2)
        // forEach(this.PL(), (Pi,j)=>{
        //     let P = Pi.P
        //     let a = Pi.a
        //     let b = L - Pi.a
        //     if(a < L1){
        //         Ri =  Ri + P*b/L
        //     }
        //     if(a < L1 + L2){
        //         Ri =  Ri + P*b/L
        //     }
        //     else{
        //         Ri =  Ri + P*(a-L)/L
        //     }
        // }) 
        return Ri
    }//RR


    RR(){
        let Ri = 0
        let L1 = this.L1
        let L2 = this.L2
        let L3 = this.L3
        let L = this.L
        let w = this.w

        Ri = w*L*(L-2*L1)/(2*L2)
        // forEach(this.PL(), (Pi,j)=>{
        //     let P = Pi.P
        //     let a = Pi.a
        //     if(a < L){
        //         Ri =  Ri + P*a/L
        //     }
        //     else{
        //         Ri =  Ri + P*a/L
        //     }
        // }) 
        return Ri
    }//RR

    //---------------------------------------------------
    //SHEAR
    //---------------------------------------------------
    
    Vx(){
        let V = []
        let Vi = 0
        let L1 = this.L1
        let L2 = this.L2
        let L3 = this.L3
        let L = this.L
        let w = this.w

        forEach(this.Lx(), (x,i) =>{
            if(x < L1){
                Vi = -w*x
            }
            if(x > L1){
                Vi = this.RL() - w*x
            }
            if(x > L1 + L2){
                Vi = this.RL() + this.RR() - w*x
            }
            
            // forEach(this.PL(), (Pi,j)=>{
            //     let P = Pi.P
            //     let a = Pi.a
            //     let b = L - a
               
            //     if(x <= a){
            //         Vi = Vi + P*Math.pow(b,2)/(2*Math.pow(L,3))*(a+2*L)
            //     }//IF
            //     else{
            //         Vi = Vi + P*Math.pow(b,2)/(2*Math.pow(L,3))*(a+2*L) - P
            //     }//ELSE
            // })//P LOOP
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
        let c = this.L1
        let d = this.L2
        let e = this.L3
        let L = this.L
        let w = this.w
       
        forEach(this.Lx(), (x,i) =>{
            if(x < c){
                Mi = -w*Math.pow(c-x,2)/2
                //Mi = -w*Math.pow(x,2)/2
            }
            if(x > c){
                Mi = -w*Math.pow(c+x,2)/2 + this.RL()*x
                //Mi =  - w*Math.pow(L1+(x-L1),2)/2 + this.RL()*x
            }
            if(x > c + d){
                Mi = -w*Math.pow(e+d-x,2)/2
                //Mi =  - w*Math.pow((L1 + L2 + L3)-x,2)/2
            }
            // forEach(this.PL(), (Pi,j)=>{
            //     let P = Pi.P
            //     let a = Pi.a
            //     let b = L - a
                
            //     if(a <= this.L){
            //         if(x <= a){
            //             Mi = Mi + P*b*x/L
            //         }//IF
            //         else{
            //             Mi = Mi + P*b*x/L - P*(x-a)
            //         }//ELSE
            //     }
            //     else{
            //         Mi = Mi + P*(x-L)
            //     }
            // })//P LOOP
            M.push(Mi)
        })//X LOOP

        return M
    }

    //MAXIMUM MOMENT
    Mmax(){
        return Math.max(...this.Mx())
    }

    MCL(){
        return this.w*Math.pow(this.L1,2) /2
    }
    MCR(){
        return this.w*Math.pow(this.L2,2) /2
    }

    //DISTANCE FROM LEFT SUPPORT TO MAXIMUM MOMENT
    xm(){
        let index = findIndex(this.Mx(), (x) => x == this.Mmax())
        let arr = this.Lx()

        return arr[index]
    }

    xc(){
        let arrM = this.Mx()
        let arrX =  map(this.Lx(), (x,i) =>{
            if(arrM[i] > 0 && arrM[i+1] < 0){
                return x
            }
        })
        return arrX
    }

    XCL(){
        return first(this.xc())
    }
    XCR(){
        return last(this.xc())
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
        let c = this.L1
        let d = this.L2
        let e = this.L3
        let w = this.w
        let L = this.L
        let E = this.E
        let I = this.I

        let xm = 0
        let x2 = 0
        


        //REFERENCE
        //https://www.engineersedge.com/beam_bending/beam_bending43.htm
        forEach(this.Lx(), (x,i) =>{
            if(x < c){
                Di = w*L*x*1728*(2*d*(Math.pow(e,2)+2*Math.pow(c,2)) + 6*Math.pow(c,2)*x - Math.pow(x,2)*(4*c-x) - Math.pow(d,3))/(24*E*I*L)
                //Di = (w*(L1-x)*(L2*(Math.pow(L2,2)-4*Math.pow(L1,2)-2*Math.pow(L3,2))-Math.pow(L1,2)*(3*L1-x)+Math.pow(x,2)*(L1+x))*1728)/(24*E*I)
            }
            if(x > c){
                Di = w*L*x*(d-x)*1728*(x*(d-x) + Math.pow(d,2) - 2*(Math.pow(c,2)+Math.pow(e,2)) - 2/d*(Math.pow(e,2)*x+Math.pow(c,2)*(d-x)))/(24*E*I*L)
                //xm = x - L1
                //Di = -(w*xm*(L2-xm)*(L2*(L2*(L2+xm)-Math.pow(xm,2))-2*(Math.pow(L1,2)*(2*L2-xm)+Math.pow(L3,2)*(L2+xm)))*1728)/(24*E*I*L2)
            }
            if(x > c + d){
                Di = w*L*(x-d)*1728*(2*d*(Math.pow(c,2)+2*Math.pow(e,2)) + 6*Math.pow(e,2)*(x-d) - Math.pow(x-d,2)*(4*e+d-x) - Math.pow(d,3))/(24*E*I*L)
                //x2 = x - (L1 + L2)
                //Di = (w*x2*(L2*(Math.pow(L2,2)-2*Math.pow(L1,2)-4*Math.pow(L3,2))-x2*(6*Math.pow(L3,2)-4*L3*x2+Math.pow(x2,2)))*1728)/(24*E*I)
            }
            
            // forEach(this.PL(), (Pi,j)=>{
            //     let P = Pi.P
            //     let a = Pi.a
            //     let b = L - a
            //     if(x <= a){
            //         Di =  Di + (P*Math.pow(b,2)*x*1728)/(12*E*I*Math.pow(L,3))*(3*a*Math.pow(L,2)-2*L*Math.pow(x,2)-a*Math.pow(x,2))
            //     }//IF
            //     else{
            //         Di =  Di + (P*a*Math.pow(L-x,2)*1728)/(12*E*I*Math.pow(L,3))*(3*Math.pow(L,2)*x-Math.pow(a,2)*x-2*Math.pow(a,2)*L)
            //     }//ELSE
            // })//P LOOP
            D.push(Di)
        })//X LOOP

        return D
    }

    //MAXIMUM DEFLECTION
    Dmax(){
        return Math.max(...this.Dx())
    }
    DCL(){
        return first(this.Dx())
    }
    DCR(){
        return last(this.Dx())
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
            _ : " ",
            Lx : this.Lx(),
            //Vp : this.plotV()
        }
    }
    shearParams(){
        return{
            xv : this.xm(),
            _ : " ",
            _ : " ",
            Vx : this.Vx(),
            //Vp : this.plotV()
        }
    }
    flexureParams(){
        return{
            xm : this.xm(),
            xcl : this.XCL(),
            xcr : this.XCR(),
            Mx : this.Mx(),
            //Mp : this.plotM()
        }
    }
    deflectionParams(){
        return{
            xd : this.xd(),
            _ : " ",
            _ : " ",
            Dx : this.Dx(),
            //Dp : this.plotD()
        }
    }
}//CLASS