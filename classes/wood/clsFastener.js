import Wood from '@/classes/wood/clsWood'
import {sin,cos,ArrayMin} from '@/library/mathLib'

export default class Fastener extends Wood{
    constructor({method,duration,moisture,temperature,L=2,D=0.211,ts=1.5,tm=1.5,Gs=0.5,Gm=0.5,theta_main=0,theta_side=0,shearPlane=1,fastenerType="Nail",sideType="Wood",mainType="Wood"}){
        super({ method, duration, moisture, temperature})
        this.L = L
        this.D = D
        this.ts = ts
        this.tm = tm
        this.Gs = Gs
        this.Gm = Gm
        this.theta_main = theta_main
        this.theta_side= theta_side
        this.ls = this.ts
        this.lm = this.tm
        this.shearPlane = shearPlane
        this.fastenerType = fastenerType
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
        switch(this.fastenerType){
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
    Fe(G){
        return 16600*Math.pow(G,1.84)
    }

    //DOWEL BEARING STRENGTH D > 0.25 PERPENDICULAR TO GRAIN
    Fe_per(G){
        return 6100*Math.pow(G,1.45)*Math.pow(this.D,-0.15)
    }

    //DOWEL BEARING STRENGTH D > 0.25 PARALLEL TO GRAIN
    Fe_par(G){
        return 11200*G
    }

    //DOWEL BEARING STRENGTH D > 0.25 PERPENDICULAR TO ANGLE TO GRAIN
    Fe_theta(G,theta){
        return (this.Fe_par(G) * this.Fe_per(G))/(this.Fe_par(G)*Math.pow(sin(theta),2) + this.Fe_per(G)*Math.pow(cos(theta),2))
    }

    //DOWEL BEARING STRENGTH IN MAIN MEMBER
    Fem(){
        switch(this.fastenerType){
            case "Nail" :
                return this.Fe(this.Gm)
                break
            default :
                return this.mainType == "Wood" ? this.Fe_theta(this.Gm,this.theta_main) : 7500
                break
        }//SWITCH
    }//Fem

    //DOWEL BEARING STRENGTH IN SIDE MEMBER
    Fes(){
        switch(this.fastenerType){
            case "Nail" :
                return this.sideType == "Wood" ? this.Fe(this.Gs) : 1.5 * this.Fu()
                break
            default :
                return this.sideType == "Wood" ? this.Fe_theta(this.Gs,this.theta_side) : 1.5 * this.Fu()
                break
        }//SWITCH
    }//Fes

    //PENETRATION IN MAIN MEMBER
    p(){
        return this.L - this.ts
    }
    //MINIMUM PENETRATION IN MAIN MEMBER
    p_min(){
        switch(this.fastenerType){
            case "Nail" :
                return 6*this.D
                break
            case "Wood Screw" :
                return 6 * this.D
                break
            case "Lag Screw" :
                return 4 * this.D
                break
            case "Bolt" :
                return 4 * this.D
                break
            
        }//SWITCH
    }

    //PENETRATION IN MAIN MEMBER
    pm(){
        return Math.min(this.p(), this.tm)
    }

    //WITHDRAWAL CAPACITY
    W(){
        switch(this.fastenerType){
            case "Nail" :
                return 1380 * Math.pow(this.Gm,5/2)*this.D 
                break
            case "Wood Screw" :
                return 2850 * Math.pow(this.Gm,2)*this.D 
                break
            case "Lag Screw" :
                return 1800 * Math.pow(this.Gm,3/2)*Math.pow(this.D,3/4) 
                break
            case "Bolt" :
                return 0
                break

           
        }//SWITCH
    }//WITHDRAWAL


    Re(){
    	return this.Fem()/this.Fes();
	}

	Rt(){
    	return this.lm/this.ts
    }

    Rd(){
        return (this.D <= 0.17) ? 2.2 : 10*this.D + 0.5
    }//KD

    // k(){
    // 	let re = this.Re();
    // 	let rt = this.Rt();
    // 	let r2e = Math.pow(this.Re(),2);
    // 	let r3e = Math.pow(this.Re(),3);
    // 	let r2t = Math.pow(this.Rt(),2);
    // 	let ka= (Math.pow(re+2*r2e*(1+rt+r2t)+r2t*r3e,0.5)-re*(1+rt))/(1+re) ;
    // 	let kb = -1+Math.pow(2*(1+re)+(2*this.Fyb*((1+2*re)*Math.pow(this.D,2)))/(3*this.Fem()*Math.pow(this.lm,2)),0.5);
    // 	let kc = -1+Math.pow(2*(1+re)/re+(2*this.Fyb*(2+re)*Math.pow(this.D,2))/(3*this.Fem()*Math.pow(this.ls,2)),0.5);
  	
    // 	return ({k1:ka,k2:kb,k3:kc})
    // }//k

    k1(){
    	let re = this.Re();
    	let rt = this.Rt();
    	let r2e = Math.pow(this.Re(),2);
    	let r3e = Math.pow(this.Re(),3);
    	let r2t = Math.pow(this.Rt(),2);
    	return (Math.pow(re+2*r2e*(1+rt+r2t)+r2t*r3e,0.5)-re*(1+rt))/(1+re) ;
    }//k

    k2(){
    	let re = this.Re();
    	let rt = this.Rt();
    	let r2e = Math.pow(this.Re(),2);
    	let r3e = Math.pow(this.Re(),3);
    	let r2t = Math.pow(this.Rt(),2);
    	
    	return -1+Math.pow(2*(1+re)+(2*this.Fyb()*((1+2*re)*Math.pow(this.D,2)))/(3*this.Fem()*Math.pow(this.lm,2)),0.5)
    }//k

    k3(){
    	let re = this.Re();
    	let rt = this.Rt();
    	let r2e = Math.pow(this.Re(),2);
    	let r3e = Math.pow(this.Re(),3);
    	let r2t = Math.pow(this.Rt(),2);
    	
    	return -1+Math.pow(2*(1+re)/re+(2*this.Fyb()*(2+re)*Math.pow(this.D,2))/(3*this.Fem()*Math.pow(this.ls,2)),0.5)
    }//k

    Im(){
        return this.D*this.lm*this.Fem()/this.Rd()
    }

    Is(){
        return this.D*this.ls*this.Fes()/this.Rd()
    }

    II(){
        return this.k1()*this.D*this.ls*this.Fes()/this.Rd()
    }

    IIIm(){
        return (this.k2()*this.D*this.lm*this.Fem())/((1+2*this.Re())*this.Rd())
    }

    IIIs(){
        return (this.k3()*this.D*this.ls*this.Fem())/((2+this.Re())*this.Rd())
    }

    IV(){
        return Math.pow(this.D,2)/this.Rd() * Math.pow((2*this.Fem()*this.Fyb())/(3*(1+this.Re())),0.5)
    }

    Z(){
        return 100
    }

    fastenerParams(){
        return{
            type : this.fastenerType,
            p : this.p(),
            p_min : this.p_min(),
            pm : this.pm(),
            Fu : this.Fu(),
            Fyb : this.Fyb()
        }    
    }

    modeParams(){
        return{
            Re : this.Re(),
            Rt : this.Rt(),
            Rd : this.Rd(),
            k1 : this.k1(),
            k2 : this.k2(),
            k3 : this.k3(),
            Im : this.Im(),
            Is : this.Is(),
            II : this.II(),
            IIIm : this.IIIm(),
            IIIs : this.IIIs(),
            IV : this.IV(),
        }
    }

    mainParams(){
        return{
            Fem : this.Fem()
        }
    }

    sideParams(){
        return{
            Fes : this.Fes()
        }
    }

    shearParams(){
        return{
            CD : this.CD(),
            Z : this.Z(),
        }
    }

    withdrawalParams(){
        return{
            W : this.W(),
        }
    }


}//CLASS