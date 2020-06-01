import Wood from '@/classes/wood/clsWood'
import {sin,cos,ArrayMin} from '@/library/mathLib'

export default class Dowel extends Wood{
    constructor({method,duration,moisture,temperature,L=2,D=0.211,ts=1.5,tm=1.5,Gs=0.5,Gm=0.5,theta=0,shearPlane=1,dowelType="Nail",sideType="Wood",mainType="Wood"}){
        super({ method, duration, moisture, temperature})
        this.L = L
        this.D = D
        this.ts = ts
        this.tm = tm
        this.Gs = Gs
        this.Gm = Gm
        this.G = Math.min(Gs,Gm)
        this.theta = theta
        this.Fyb = 90000
        this.ls = this.ts
        this.lm = this.tm
        this.shearPlane = shearPlane
        this.dowelType = dowelType
        this.sideType = sideType
        this.mainType = mainType
    }//CONSTRUCTOR

    //DURATION FACTOR
    CD(){
        return Math.min(super.CD(),1.6)
    }//CD

    Fu(){
        switch(this.sideType){
            case "Wood" :
                return 0
                break
            case "Steel" :
                return 58000
                break
            case "ColdForm" :
                return 45000
                break
        }//SWITCH
    }

    //DOWEL BENDING YEILD STRENGTH
    Fyb(){
        switch(this.dowelType){
            case "Nail" :
                return 90000
                break
            case "Wood Screw" :
                return 45000
                break
            case "Lag Screw" :
                return 45000
                break
            case "Bolt" :
                return 45000
                break
        }//SWITCH
    }

    //DOWEL BEARING STRENGTH IN D < 0.25
    Fe(){
        return 16600*Math.pow(this.Gm,1.84)
    }

    //DOWEL BEARING STRENGTH D > 0.25 PERPENDICULAR TO GRAIN
    Fe_per(){
        return 6100*Math.pow(this.G,1.45)*Math.pow(this.D,-0.15)
    }

    //DOWEL BEARING STRENGTH D > 0.25 PARALLEL TO GRAIN
    Fe_par(){
        return 11200*this.G
    }

    //DOWEL BEARING STRENGTH D > 0.25 PERPENDICULAR TO ANGLE TO GRAIN
    Fe_theta(){
        let sin2Theta = Math.pow(sin(this.theta),2)
        let cos2Theta = Math.pow(cos(this.theta),2)

        return (this.Fe_par() * this.Fe_per())/(this.Fe_par()*sin2Theta + this.Fe_per()*cos2Theta)
    }

    //DOWEL BEARING STRENGTH IN MAIN MEMBER
    Fem(){
        switch(this.dowelType){
            case "Nail" :
                return this.Fe()
                break
            default :
                return this.mainType == "Wood" ? this.Fe_theta() : 7500
                break
        }//SWITCH
    }//Fem

    //DOWEL BEARING STRENGTH IN SIDE MEMBER
    Fes(){
        switch(this.dowelType){
            case "Nail" :
                return this.sideType == "Wood" ? this.Fe() : 1.5 * this.Fu()
                break
            default :
                return this.mainType == "Wood" ? this.Fe_theta() : 7500
                break
        }//SWITCH
    }//Fes

    //PENETRATION IN MAIN MEMBER
    p(){
        return this.L - this.ts
    }
    //MINIMUM PENETRATION IN MAIN MEMBER
    p_min(){
        switch(this.dowelType){
            case "Nail" :
                return 6*this.D
                break
            case "Wood Screw" :
                return 6 * this.D
                break
            case "Lag Screw" :
                return 4 * this.D
                break
            
        }//SWITCH
    }

    //WITHDRAWAL CAPACITY
    W(){
        switch(this.dowelType){
            case "Nail" :
                return 0
                break
            case "Wood Screw" :
                return 2800 * Math.pow(this.Gm,2)*this.D * this.p()
                break
            case "Lag Screw" :
                return 1800 * Math.pow(this.Gm,3/2)*Math.pow(this.D,3/4) * this.p()
                break
           
        }//SWITCH
    }//WITHDRAWAL


    Re(){
    	return this.Fem()/this.Fes();
	}

	Rt(){
    	return this.lm/this.ts
    }

    k(){
    	let re = this.Re();
    	let rt = this.Rt();
    	let r2e = Math.pow(this.Re(),2);
    	let r3e = Math.pow(this.Re(),3);
    	let r2t = Math.pow(this.Rt(),2);
    	let ka= (Math.pow(re+2*r2e*(1+rt+r2t)+r2t*r3e,0.5)-re*(1+rt))/(1+re) ;
    	let kb = -1+Math.pow(2*(1+re)+(2*this.Fyb*((1+2*re)*Math.pow(this.D,2)))/(3*this.Fem()*Math.pow(this.lm,2)),0.5);
    	let kc = -1+Math.pow(2*(1+re)/re+(2*this.Fyb*(2+re)*Math.pow(this.D,2))/(3*this.Fem()*Math.pow(this.ls,2)),0.5);
  	
    	return ({k1:ka,k2:kb,k3:kc})
    }//k

}//CLASS