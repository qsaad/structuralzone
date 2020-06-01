export default class Masonry {
    constructor({ fm = 1500}){
        this.fm = fm
    }

    //CONCRETE MODULUS OF ELASTICITY (ksi)
    Em(){
        return 900*this.fm
    }
    //STEEL MODULUS OF ELASTICITY
    Es(){
        return 29000000
    }
    //ALLOWABLE BENDING STRESS
    Fb(){
        return 0.45*this.fm
    }
    //ALLOWABLE REBAR TENSILE STRESS
    Fs(){
        return 320000
    }
    //MODULUS OF RUPTURE
    Fr(){
        return 2.5*Math.pow(this.fm,0.5)
    }
    //MODULAR RATIO
    n(){
        return this.Es()/this.Em()
    }
    //BALANCED
    kb(){
        return this.Fb()/(this.Fb() + this.Fs()/this.n())
    }
    //REBAR SIZE
    rebar(size){
        switch (size){
            case '#3':
                return {Wt:0.376,d:0.375,A:0.11}
                break
            case '#4':
                return {Wt:0.668,d:0.5,A:0.20}
                break
            case '#5':
                return {Wt:1.043,d:0.625,A:0.31}
                break
            case '#6':
                return {Wt:1.502,d:0.75,A:0.44}
                break
            case '#7':
                return {Wt:2.044,d:0.875,A:0.6}
                break
            case '#8':
                return {Wt:2.67,d:1,A:0.79}
                break
            case '#9':
                return {Wt:3.40,d:1.128,A:1}
                break
            case '#10':
                return {Wt:4.303,d:1.27,A:1.27}
                break
            case '#11':
                return {Wt:5.313,d:1.41,A:1.56}
                break
            case '#14':
                return {Wt:7.65,d:1.693,A:2.25}
                break
            case '#18':
                return {Wt:13.6,d:2.257,A:4}
                break
        }//SWITCH
    }//REBAR SIZE
   

}//CLASS