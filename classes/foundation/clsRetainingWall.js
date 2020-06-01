import Foundation from '@/classes/foundation/clsFoundation'
import {rebar,flexureRebarArea,Ld,Ldh,onewayShearCapacity} from '@/library/concreteLib'
import {interpolate} from '@/library/mathLib'

export default class RetainingWall extends Foundation {
    constructor({  fc=3000, Fy=60000, SBC=2, tw=8,Hs=8, Hk=0, HBF=8, HTF=2, Lh=4, Lt=1, tb=12, rho_s=110, phi_s=30, nu_s=0.5, PX=0, PY=0, SCL=0, WLE=0,rebarSizeStem="#5",rebarSizeHeel="#5",rebarSizeToe="#5",rebarSizeTemp="#5"}) {
        super({ fc, Fy })
        this.SBC = SBC
        this.tw = tw                //WALL THICKNESS (in)
        this.Hs = Hs                //HEIGHT OF STEM WALL (ft)
        this.Hk = Hk
        this.Lh = Lh                //HEEL LENGTH (ft)
        this.Lt = Lt                //TOE LENGTH (ft)
        this.tb = tb                //BASE THICKNESS (in)
        this.L = Lt + tw/12 + Lh    //BASE LENGTH (ft)
        this.HBF = HBF              //HEIGHT OF BACKFILL (ft)
        this.HTF = HTF              //HEIGHT OF TOEFILL (ft)
        this.H = HBF + HTF + tb/12  //TOTAL HEIGHT (BACKFILL + TOEFILL + BASE)
        this.Hb = HBF + HTF         //TOTAL BACKFILL HEIGHT (BACKFILL + TOEFILL)

        this.rho_s = rho_s/1000     //SOIL DENSITY (kcf)
        this.phi_s = phi_s          //SOIL ANGLE OF INTERNAL FRICTION
        this.nu_s = nu_s            //BASE FRICTION COEFFICIENT
        this.rho_w = 62.4/1000      //WATER DENSITY (kcf)

        this.PX = PX                //LATERAL AT WALL TOP (klf)
        this.PY = PY                //GRAVITY LOAD AT WALL TOP (klf)
        this.SCL = SCL/1000         //SURCHARGE LOAD (ksf)
        this.WLE = WLE              //WATER LEVEL ELEVATION (ft)

        this.rebarSizeStem = rebarSizeStem 
        this.rebarSizeHeel = rebarSizeHeel 
        this.rebarSizeToe = rebarSizeToe 
        this.rebarSizeTemp = rebarSizeTemp 

    } // CONSTRUCTOR

    //ACTIVE PRESSURE COEFFICIENT
    Ka(){
        let phi = this.phi_s*Math.PI/180
        return (1 - Math.sin(phi))/(1 + Math.sin(phi))
    }

    //PASSIVE PRESSURE COEFFICIENT
    Kp(){
        return 1/this.Ka()
    }

    //------------------------------------------------
    //ACTIVE SOIL PRESSURE
    //------------------------------------------------
    active(){
        let F = 0.5*this.Ka()*this.rho_s*Math.pow(this.H,2)
        let y = this.H/3
        let Mo = F * y

        let Fu = this.ELF*0.5*this.Ka()*this.rho_s*Math.pow(this.Hb,2)
        let yu = this.Hb/3
        let Mu = Fu * yu
        let Vu = Fu

        return {F,y,Mo,Fu,yu,Mu,Vu}
    }

    //------------------------------------------------
    //SURCHARGE PRESSURE AND WEIGHT
    //------------------------------------------------
    surcharge(){
        let hsu = this.SCL/this.rho_s
        let F = this.Ka()*this.rho_s*hsu*this.H
        let y = this.H/2
        let Mo = F * y

        let W = this.SCL*this.Lh
        let x = this.L - this.Lh/2
        let Mr = W * x
        
        let Fu = this.ELF*this.Ka()*this.rho_s*hsu*this.Hb
        let yu = this.Hb/2
        let Mus = Fu * yu
        let Vus = Fu

        let Wu = this.LLF*W
        let xu = this.Lh/2
        let Muh =  Wu * xu
        let Vuh = Wu


        return {F,y,Mo,W,x,Mr,Fu,yu,Mus,Vus,Wu,xu,Muh,Vuh}
    }

    //------------------------------------------------
    //GROUND WATER PRESSURE
    //------------------------------------------------
    water(){
        let F = 0.5*this.rho_w*Math.pow(this.WLE,2)/2
        let y = this.WLE/3
        let Mo = F * y

        let hw = this.WLE > this.tb/12 ? this.WLE-this.tb/12 : 0

        let Fu = this.ELF*0.5*this.rho_w*Math.pow(hw,2)/2
        let yu = hw/3
        let Mu = Fu * yu
        let Vu = Fu

        return {F,y,Mo,Fu,yu,Mu,Vu}
    }

    //------------------------------------------------
    //LATERAL LOAD AT TOP OF WALL
    //------------------------------------------------
    lateral(){
        let F = this.PX
        let y = this.Hs + this.tb/12
        let Mo = F * y

        let Fu = this.LLF*this.PX
        let yu = this.Hs
        let Mu = Fu * yu
        let Vu = Fu

        return {F,y,Mo,Fu,yu,Mu,Vu}
    }

    //------------------------------------------------
    //BACKFILL WEIGHT
    //------------------------------------------------
    backfill(){
        let W = (this.HBF+this.HTF)*this.Lh*this.rho_s
        let x = this.L - this.Lh/2
        let Mr = W * x

        let Wu = this.DLF*W
        let xu = this.Lh/2
        let Mu = Wu * xu
        let Vu = Wu

        return {W,x,Mr,Wu,xu,Mu,Vu}
    }

    //------------------------------------------------
    //TOE FILL WEIGHT
    //------------------------------------------------
    toefill(){
        let W = this.HTF*this.Lt*this.rho_s
        let x = this.Lt/2
        let Mr = W * x

        let Wu = this.DLF*W
        let xu = this.Lt/2
        let Mu = Wu * xu
        let Vu = Wu

        return {W,x,Mr,Wu,xu,Mu,Vu}
    }

    //------------------------------------------------
    //PASSIVE SOIL PRESSURE
    //------------------------------------------------
    passive(){
        let h = this.HTF + this.tb/12
        let F = 0.5*this.Kp()*this.rho_s*Math.pow(h,2)
        let x = h/3
        let Mr = F * x

        let Fu = this.ELF*this.Kp()*this.rho_s*Math.pow(this.HTF,2)
        let yu = this.HTF/3
        let Mu = Fu * yu
        let Vu = Fu

        return {F,x,Mr,Fu,yu,Mu,Vu}
    }

    //------------------------------------------------
    //STEM WEIGHT AND FORCES
    //------------------------------------------------
    stem(){
        let W = this.Hs*this.tw/12*this.rho_c/1000
        let x = this.Lt + this.tw/(2*12)
        let Mr = W*x

        let Mu = this.active().Mu + this.surcharge().Mus + this.water().Mu + this.lateral().Mu - this.passive().Mu
        let Vu = this.active().Vu + this.surcharge().Vus + this.water().Vu + this.lateral().Vu - this.passive().Vu
        let fVn = onewayShearCapacity({b:12,h:this.tw,fc:this.fc,rebarSize:this.rebarSizeStem})

        let Ab =  rebar(this.rebarSizeStem).A
        let Ar =  flexureRebarArea({Mu:Mu, rebarSize:this.rebarSizeStem, h:this.tw, fc:this.fc }).A
        let Ldr = Ldh({rebarSize:this.rebarSizeStem, fc:this.fc})
        let Lda = this.tb - 3 - rebar(this.rebarSizeStem).d- rebar(this.rebarSizeTemp).d
        let Sb = (Ab/Ar)*12
        let Ldp = Lda/Ldr

        return {W,x,Mr,Mu,Vu,fVn,Sb,Ldr,Lda,Ldp}
    }

    stemParameters(){
        return[
            { name : 'Active Pressure', Fu : this.active().Fu, yu : this.active().yu, Mu : this.active().Mu },
            { name : 'Surcharge Pressure', Fu : this.surcharge().Fu, yu : this.surcharge().yu, Mu : this.surcharge().Mus },
            { name : 'Water Pressure', Fu : this.water().Fu, yu : this.water().yu, Mu : this.water().Mu },
            { name : 'Lateral Load', Fu : this.lateral().Fu, yu : this.lateral().yu, Mu : this.lateral().Mu },
            { name : 'Passive Pressure', Fu : -this.passive().Fu, yu : this.passive().yu, Mu : -this.passive().Mu }

        ]
    }

    //------------------------------------------------
    //BASE WEIGHT
    //------------------------------------------------
    base(){
        let W = this.L*this.tb/12 * this.rho_c/1000
        let x = this.L/2
        let Mr = W*x
      
        return {W,x,Mr}
    }

    //------------------------------------------------
    //GRAVITY LOAD AT TOP OF WALL
    //------------------------------------------------
    gravity(){
        let W = this.PY
        let x = this.Lt + this.tw/(2*12)
        let Mr = W*x
      
        return {W,x,Mr}
    }

    //------------------------------------------------
    //HEEL FORCES
    //------------------------------------------------
    heel(){
        let wt = this.Lh*this.tb/12*this.rho_c/1000
        let Wu = this.DLF*wt
        let xu = this.Lh/2

        let Mu = Wu*xu + this.backfill().Mu + this.surcharge().Muh - this.basePressure().Muh
        let Vu = Wu + this.backfill().Vu + this.surcharge().Vuh - this.basePressure().Vuh
        let fVn = onewayShearCapacity({b:12, h:this.tb, cov:3, fc:this.fc, rebarSize:this.rebarSizeHeel})

        let Ab =  rebar(this.rebarSizeHeel).A
        let Ar =  flexureRebarArea({Mu:Mu, rebarSize:this.rebarSizeHeel, h:this.tb, fc:this.fc }).A
        let Ldr = Ld({rebarSize:this.rebarSizeStem, fc:this.fc})
        let Lda = this.Lt*12 + this.tw - 1.5
        let Sb = (Ab/Ar)*12
        let Ldp = Lda/Ldr

        return {Wu,xu,Mu,Vu,fVn,Sb,Ldr,Lda,Ldp}
    }

    heelParameters(){
        return[
            { name : 'Backfill Weight', Wu : this.backfill().Wu, xu : this.backfill().xu, Mu : this.backfill().Mu },
            { name : 'Surcharge Weight', Wu : this.surcharge().Wu, xu : this.surcharge().xu, Mu : this.surcharge().Muh },
            { name : 'Heel Weight', Wu : this.heel().Wu, xu : this.heel().xu, Mu : this.heel().Wu*this.heel().xu },
            { name : 'Base Pressure', Wu : -this.basePressure().Fuh, xu : this.basePressure().xuh, Mu : -this.basePressure().Muh }
        ]
    }

    //------------------------------------------------
    //TOE FORCES
    //------------------------------------------------
    toe(){
        let wt = this.Lt*this.tb/12*this.rho_c/1000
        let Wu = this.DLF*wt 
        let xu = this.Lt/2

        let Mu = this.basePressure().Mut - (Wu*xu + this.toefill().Mu) 
        let Vu = this.basePressure().Vut - (Wu + this.toefill().Vu)
        let fVn =  onewayShearCapacity({b:12,h:this.tb,cov:3,fc:this.fc,rebarSize:this.rebarSizeToe})

        let Ab = rebar(this.rebarSizeToe).A
        let Ar =  flexureRebarArea({Mu:Mu, rebarSize:this.rebarSizeToe, h:this.tb, cov:3, fc:this.fc}).A
        let Ldr = Ld({rebarSize:this.rebarSizeToe, fc:this.fc})
        let Lda = this.Lh*12 + this.tw - 1.5
        let Sb = (Ab/Ar)*12
        let Ldp = Lda/Ldr

        return {Wu,xu,Mu,Vu,fVn,Sb,Ldr,Lda,Ldp}
    }

    toeParameters(){
        return[
            { name : 'Toefill Weight', Wu : -this.toefill().Wu, xu : this.toefill().xu, Mu : -this.toefill().Mu },
            { name : 'Toe Weight', Wu : -this.toe().Wu, xu : this.toe().xu, Mu : -this.toe().Wu*this.toe().xu },
            { name : 'Base Pressure', Wu : this.basePressure().Fut, xu : this.basePressure().xut, Mu : this.basePressure().Mut }
        ]
    }
   
    //TOTAL WEIGHT
    TotalWeight(){
        return this.stem().W + this.base().W + this.backfill().W + this.surcharge().W + this.toefill().W + this.gravity().W
    }

    //TOTAL BASE FRICTION RESISTANCE
    TotalSlidingResistance(){
        return this.TotalWeight()*this.nu_s + this.passive().F
    }

    //TOTAL SLIDING FORCE
    TotalSlidingForce(){
        return this.active().F + this.surcharge().F + this.water().F + this.lateral().F 
    }

    //------------------------------------------------
    //STABILITY CHECK
    //------------------------------------------------

    //OVERTURNING MOMENT
    OverturningMoment(){
        return this.active().Mo + this.surcharge().Mo + this.water().Mo + this.lateral().Mo
    }

    //RESISTING MOMENT
    ResistingMoment(){
        return this.stem().Mr + this.base().Mr + this.backfill().Mr + this.surcharge().Mr + this.toefill().Mr + this.passive().Mr + this.gravity().Mr
    }

    //SLIDING STABILITY
    slidingStability(){
        return this.TotalSlidingResistance()/this.TotalSlidingForce()
    }

    //OVERTURN STABILITY
    overturningStability(){
        return this.ResistingMoment()/this.OverturningMoment()
    }

    overturningParameters(){
        let h = this.H
        let hw = this.WLE
        let hs = this.Hs + this.tb/12

        return [
            { name : 'Active Pressure', F : this.active().F, y : this.active().y, M : this.active().Mo },
            { name : 'Surcharge Pressure', F : this.surcharge().F, y : this.surcharge().y, M : this.surcharge().Mo },
            { name : 'Water Pressure', F : this.water().F, y : this.water().y, M : this.water().Mo },
            { name : 'Lateral Load', F : this.lateral().F, y : this.lateral().y, M : this.lateral().Mo }
        ]
    }

    resistingParameters(){
        return [
            {name:'Backfill', W : this.backfill().W, x : this.backfill().x, M : this.backfill().Mr },
            {name:'Surcharge ', W : this.surcharge().W, x : this.surcharge().x, M : this.surcharge().Mr },
            {name:'Stem', W : this.stem().W, x : this.stem().x, M : this.stem().Mr },
            {name:'Toefill', W : this.toefill().W, x : this.toefill().x, M : this.toefill().Mr },
            {name:'Base', W : this.base().W, x : this.base().x, M : this.base().Mr },
            {name:'Gravity', W : this.gravity().W, x : this.gravity().x, M : this.gravity().Mr },
            {name:'Passive', W : this.passive().F, x : this.passive().x, M : this.passive().Mr },
        ]
    }

    stability(){
        return{
            W : this.TotalWeight(),
            OM : this.OverturningMoment(),
            RM : this.ResistingMoment(),
            F : this.TotalSlidingForce(),
            R : this.TotalSlidingResistance(),
            FSS : this.slidingStability(),
            FSO : this.overturningStability()
        }
    }

    //BASE BEARING PRESSURE
    basePressure(){
        let W = this.TotalWeight()
        let Wu = this.DLF*W
        let B = 1
        let A = this.L*B
        let S = B*Math.pow(this.L,2)/6
        let qmax = 0
        let qmin = 0
        let Lb = 0
        let qumax = 0
        let qumin = 0
        let Lbu = 0
        let qut = 0
        let quh = 0
        let Fut = 0
        let xut = 0
        let Mut = 0
        let Vut = 0
        let Fuh = 0
        let xuh = 0
        let Muh = 0
        let Vuh = 0
        let xr = (this.ResistingMoment()-this.OverturningMoment())/this.TotalWeight()
        let e = Math.abs(this.L/2 - xr)
        let xur = (this.DLF*this.ResistingMoment()-this.ELF*this.OverturningMoment())/(this.DLF * this.TotalWeight())
        let eu = Math.abs(this.L/2 - xur)
        let kern = this.L/6

        if(e <= kern){
            qmax =  W/A + (W*e)/S
            qmin =  W/A - (W*e)/S
            Lb = this.L
        }
        else{
            qmax =  (2*W)/(3*xr)
            qmin = 0
            Lb = 3*xr
        }


        if(eu <= kern){
            qumax =  Wu/A + (Wu*eu)/S
            qumin =  Wu/A - (Wu*eu)/S
            Lbu = this.L
        }
        else{
            qumax =  (2*Wu)/(3*xur)
            qumin = 0
            Lbu = 3*xur
        }


        qut = interpolate(0,qumin,Lbu,qumax,Lbu-this.Lt)
        quh = interpolate(0,qumin,Lbu,qumax,Lbu-this.Lt-this.tw/12)

        if(Lbu == this.L){
            Fuh = 0.5*(quh + qumin)*this.Lh
            xuh = this.Lh*(2*qumin + quh)/(3*(qumin + quh))
            Muh = Fuh * xuh
            Fut = 0.5*(qumax + quh)*this.Lt
            xut = this.Lt - this.Lt*(2*qut + qumax)/(3*(qut + qumax))
        }
        else{

        }

        Muh = Fuh * xuh
        Vuh = Fuh
        Mut = Fut * xut
        Vut = Fut
        
        return{W, A, S, kern,e,xr,qmax,qmin,Lb,Wu,eu,xur,qumax,qumin,Lbu,qut,quh,Fut,xut,Mut,Vut,Fuh,xuh,Muh,Vuh}
    }

    basePressureParameters(){
        return [
            {name:'Allowable', e : this.basePressure().e, xr : this.basePressure().xr, Lb : this.basePressure().Lb, qmax : this.basePressure().qmax, qmin : this.basePressure().qmin },
            {name:'Ultimate', e : this.basePressure().eu, xr : this.basePressure().xur, Lb : this.basePressure().Lbu, qmax : this.basePressure().qumax, qmin : this.basePressure().qumin  },
        ]
    }

    //------------------------------------------------
    //REBAR DESIGN
    //------------------------------------------------

    design(){
        return{
            //STEM FORCES
            Mu_s : this.stem().Mu,
            Vu_s : this.stem().Vu,
            fVn_s : this.stem().fVn,
            S_s : this.stem().Sb,
            Ld_s : this.stem().Ldp,
            //HEEL FORCES
            Mu_h : this.heel().Mu,
            Vu_h : this.heel().Vu,
            fVn_h : this.heel().fVn,
            S_h : this.heel().Sb,
            Ld_h : this.heel().Ldp,
            //TOE FORCES
            Mu_t : this.toe().Mu,
            Vu_t : this.toe().Vu,
            fVn_t : this.toe().fVn,
            S_t : this.toe().Sb,
            Ld_t : this.toe().Ldp,
        }
    }

    designParameters(){
        return [
            {name:'Stem', Mu : this.stem().Mu, Vu : this.stem().Vu, fVn : this.stem().fVn, Sb : this.stem().Sb, Ld : this.stem().Ldr },
            {name:'Heel ', Mu : this.heel().Mu, Vu : this.heel().Vu, fVn : this.heel().fVn, Sb : this.heel().Sb, Ld : this.heel().Ldr },
            {name:'Toe', Mu : this.toe().Mu, Vu : this.toe().Vu, fVn : this.toe().fVn, Sb : this.toe().Sb, Ld : this.toe().Ldr },
        ]
    }


  } //CLASS