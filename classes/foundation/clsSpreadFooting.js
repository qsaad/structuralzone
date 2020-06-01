import Foundation from '@/classes/foundation/clsFoundation'
import {rebar,flexureRebarArea,Ld,Ldh,onewayShearCapacity,punchingShearCapacity} from '@/library/concreteLib'
import {interpolate} from '@/library/mathLib'

export default class SpreadFooting extends Foundation {
    constructor({ P=50, M=20, L=12, B=12, H=12, Hp=12, Lp=12, Bp=12, rebarSizeFooting="#5", rebarSizePier="#5" , fc=3000, cov=1.5, Fy=60000}) {
    //constructor({ PDL=10, PLL=1, VDL=0, VLL=0, MDL=0, MLL=0, L=12, B=12, H=12, Hp=12, Lp=12, Bp=12, rebarSize="#5" , fc=3000, cov=1.5, Fy=60000}) {
        super({ fc, Fy })
        // this.PDL = PDL  //AXIAL DEAD LOAD
        // this.PLL = PLL  //AXIAL LIVE LOAD
        // this.PWL = PWL  //AXIAL WIND/SEISMIC LOAD
        // this.VDL = VDL  //SHEAR DEAD LOAD
        // this.VLL = VLL  //SHEAR LIVE LOAD
        // this.VWL = VWL  //SHEAR WIND LOAD
        // this.MDL = MDL  //MOMENT DEAD LOAD
        // this.MLL = MLL  //MOMENT LIVE LOAD
        // this.MWL = MWL  //MOMENT WIND/SEISMIC LOAD
        this.P = P
        this.M = M

        this.L = L      //LENGTH (PARALLEL TO MOMENT AND SHEAR LOAD)
        this.B = B      //WIDTH (PERPENDICULAR TO MOMENT AND SHEAR LOAD)
        this.H = H      //THICKNESS OF FOOTING

        this.Hp = Hp    //PIER HEIGHT
        this.Lp = Lp    //PIER LENGTH (PARALLEL TO MOMENT AND SHEAR LOAD)
        this.Bp = Bp      //WIDTH (PERPENDICULAR TO MOMENT AND SHEAR LOAD)

        this.rebarSizeFooting = rebarSizeFooting
        this.rebarSizePier = rebarSizePier
        this.cov = cov

       
        //this.flexureParam = flexureCapacity({b,h,rebarQty,rebarSize,fc,cov,stirrupSize})
    } // CONSTRUCTOR

    //--------------------------------------
    //FORCES
    //--------------------------------------
    Pa(){
        // let LC = []
        // LC[0] = this.PDL
        // LC[1] = this.PDL + this.PLL
        // LC[2] = this.PDL + 0.75*this.PLL + 0.75*this.PWL
        // LC[3] = 0.6*this.PDL + this.PWL
        // return LC
    }

    Ma(){
        // let LC = []
        // let h = this.H + this.Hp

        // LC[0] = (this.MDL+this.VDL*h)
        // LC[1] = (this.MDL+this.VDL*h) + (this.MLL+this.VLL*h)
        // LC[2] = (this.MDL+this.VDL*h) + 0.75*(this.MLL+this.VLL*h) + 0.75*(this.MWL+this.VWL*h)
        // LC[3] = 0.6*(this.MDL+this.VDL*h) + (this.MWL+this.VWL*h)
        // return LC
    }

    Pu(){
        return 1.5*this.P
    }

    Mu(){
        return 1.5*this.M
    }

    d(){
        let data = {
            rebarSize : this.rebarSizeFooting,
            h : this.H,
            cov : 3,
        } 

        return flexureRebarArea(data).d
    }

    //--------------------------------------
    //SHEAR CHECK
    //--------------------------------------
    shear(){
        let fVn1 = 0
        let fVnp = 0

        let data ={
            b : this.B * 12,
            h : this.H,
            lp : this.Lp,
            bp : this.Bp,
            rebarSize : this.rebarSizeFooting,
            cov : 3,
            fc : this.fc
        }

        fVn1 = onewayShearCapacity(data)
        fVnp = punchingShearCapacity(data)
        
        return {fVn1,fVnp}
    }
    
    //--------------------------------------
    //BEARING PRESSURE CHECK
    //--------------------------------------
    basePressure(){
        let A = this.B * this.L
        let S = this.B * Math.pow(this.L,2)/6
        let kern = this.L/6
        let d = this.d()/12
        //let d = this.flexure().d/12

        let e = this.M/this.P
        let qmax = 0
        let qmin = 0
        let Lb = 0

        let eu = this.Mu()/this.Pu()
        let qumax = 0
        let qumin = 0
        let Lbu = 0

        let xc = (this.L-this.Lp/12)/2
        let xm = (this.L-this.Lp/12)/2 - d
        let xv1 = (xc-d/2)
        let xp = (this.L-this.Lp/12)/2 + this.Lp/12

        let qum = 0
        let qut = 0
        let quh = 0

        let Fu = 0
        let xu = 0
        let Mu = 0
        let Vu1 = 0
        
        let Vup = 0
        
        
        if(e <= kern){
            qmax =  this.P/A + (this.P*e)/S
            qmin =  this.P/A - (this.P*e)/S
            Lb = this.L
        }
        else{
            Lb = 3*(this.L/2 - e)
            qmax =  (2*this.P)/(3*Lb)
            qmin = 0
            
        }


        if(eu <= kern){
            qumax =  this.Pu()/A + (this.Pu()*eu)/S
            qumin =  this.Pu()/A - (this.Pu()*eu)/S
            Lbu = this.L
        }
        else{
            Lbu = 3*(this.L/2 - eu)
            qumax =  (2*this.Pu())/(3*Lbu)
            qumin = 0
        }


        
        switch(true){
            case Lbu > xc :
                qum = interpolate(0,qumin,Lbu,qumax,Lbu-xm)
                qut = interpolate(0,qumin,Lbu,qumax,Lbu-xc+d/2)
                quh = interpolate(0,qumin,Lbu,qumax,Lbu-xp-d/2)
                Fu = 0.5*(qumax + qum)*xm*this.B
                xu = xm - xm*(2*qum + qumax)/(3*(qum + qumax))
                Mu = Fu * xu 
                Vu1 = 0.5*(qumax + qut)*(xc-d/2)*this.B 
                Vup = 0.5*(qumax+qut)*(xc-d/2)*this.B + 0.5*(qut + quh)*(this.Lp/12+d)*(this.B-this.Bp/12) + 0.5*(quh + qumin)*(Lbu-xp-d/2)*this.B
               
                break
            case Lbu < xp :
                qum = interpolate(0,qumin,Lbu,qumax,Lbu-xm)
                qut = interpolate(0,qumin,Lbu,qumax,Lbu-xc+d/2)
                quh = 0
                Fu = 0.5*(qumax + qum)*xm*this.B
                xu = xm - xm*(2*qum + qumax)/(3*(qum + qumax))
                Mu = Fu * xu 
                Vu1 = 0.5*(qumax + qut)*(xc-d/2)*this.B 
                Vup = 0
                break
            case Lbu < xc :
                qut = 0
                quh = 0
                Fu = 0.5*qumax*Lbu*this.B
                xu = xm - Lbu/3
                Mu = Fu * xu 
                Vu1 = Fu 
                Vup = 0
                break
        }

        return {kern,A,S,e,Lb,qmax,qmin,eu,Lbu,qumax,qumin,xc,xm,xv1,xp,qum,qut,quh,Fu,xu,Mu,Vu1,Vup,d}

    }//BASE PRESSURE

    //--------------------------------------
    //FLEXURE CHECK
    //--------------------------------------
    flexure(){

        let data = {
            Mu : this.basePressure().Mu,
            rebarSize : this.rebarSizeFooting,
            b : this.B*12,
            h : this.H,
            cov : 3,
            fc : this.fc
        } 

        return {
            Mu : flexureRebarArea(data).Mu,
            Ast : flexureRebarArea(data).A,
            Nb : flexureRebarArea(data).Nb,
            Sb : flexureRebarArea(data).Sb,
            d : flexureRebarArea(data).d,
            rho : flexureRebarArea(data).rho,
            rho_min : flexureRebarArea(data).rho_min,
            rho_max : flexureRebarArea(data).rho_max,
            rho_bal : flexureRebarArea(data).rho_bal,
          
        }
    }//FLEXURE

    //--------------------------------------
    //OVERTURNING CHECK
    //--------------------------------------
    overturning(){

    }

    //--------------------------------------
    //SLIDING CHECK
    //--------------------------------------
    sliding(){

    }
   

  } //CLASS