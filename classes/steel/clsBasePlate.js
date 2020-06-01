//import {anchor} from '@/data/CON_Anchor'
import Steel from '@/classes/steel/clsSteel'
//import _ from 'lodash'
//import {ArrayMin} from '@/library/mathLib'

export default class Baseplate extends Steel {
    constructor({ method, Fy, Pr=50, Vr=0, Mr=0, type="W",section={},axis="Strong",NP=14,BP=14,Fyp=36,anchorSize={},Nb=2,de=1.5,anchorGrade={},NC=16,BC=16,fc=3000}) {
        super({ method, Fy })
        //LOAD
        this.Pr = Pr    //AXIAL LOAD
        this.Mr = Mr    //MOMENT
        this.Vr = Vr    //SHEAR FORCE
        //SECTION
        this.type = type
        this.W = section
        this.axis = axis
        //PLATE
        this.NP = NP    //BASE PLATE LENGTH
        this.BP = BP    //BASE PLATE WIDTH
        this.Fyp = Fyp
        //ANCHOR
        this.db = anchorSize.d
        this.Ab = anchorSize.A
        this.Nb = Nb
        this.de = de
        this.Fu = anchorGrade.Fu
        this.Fnt = anchorGrade.Fnt
        this.Fnv = anchorGrade.Fnv
        //PIER
        this.NC = NC    //PIER LENGTH
        this.BC = BC    //PIER WIDTH
        this.fc = fc

        switch(this.type){
            case ("W") : 
                this.NS = axis == "Strong" ? section.D : section.BF
                this.BS = axis == "Strong" ? section.BF : section.D
                this.m = (this.NP - 0.95*this.NS)/2
                this.n = (this.BP - 0.80*this.BS)/2
                break
            case ("HSS") : 
                this.NS = axis == "Strong" ? section.HT : section.B
                this.BS = axis == "Strong" ? section.B : section.HT
                this.m = (this.NP - 0.95*this.NS)/2
                this.n = (this.BP - 0.95*this.BS)/2
                break
            case ("Pipe") : 
                this.NS = section.OD
                this.BS = section.OD
                this.m = (this.NP - 0.95*this.NS)/2
                this.n = (this.BP - 0.95*this.BS)/2
                break
            case ("HSR") : 
                this.NS = section.OD
                this.BS = section.OD
                this.m = (this.NP - 0.95*this.NS)/2
                this.n = (this.BP - 0.95*this.BS)/2
                break
        }//SWITCH

    } // CONSTRUCTOR

   

    A1(){
        return this.NP * this.BP
    }//BASE PLATE AREA

    A2(){
        return this.NC * this.BC
    }//PIER AREA


    //STEP 1 - MAXIMUM BEARING STRESS
    fpmax(){
        return this.phiBrg()*0.85*(this.fc/1000)*Math.min(Math.pow(this.A2()/this.A1(),0.5),2);
    }

    //STEP 2 - MAXIMUM PRESSURE
    qmax(){
        return this.fpmax()*this.BP
     }

    //STEP 3 - ACTUAL ECCENTRICITY
    e(){
        return this.Mr*12/this.Pr
    }

    //STEP 4 - CRITICAL ECCENTRICITY
    ec(){
        return this.NP/2 - this.Pr/(2*this.qmax())
    }

    //STEP 5 - ACTUAL CONTACT LENGTH
    Y(){
        if(this.ec() == 0){
          return this.NP
      }
      else{
          if(this.e() < this.ec()){
            return this.NP - 2*this.e()
          }
          else{
            let f = this.NP/2 - this.de
            let k1 = f + this.NP/2
            let k2 = Math.pow(k1,2)
            let k3 = 2*this.Pr*(this.e() + f)/this.qmax()
            if(k2 > k3){
                let x1 = k1 + Math.pow(k2-k3,0.5)
              let x2 = k1 - Math.pow(k2-k3,0.5)
                return Math.min(x1,x2)
            }
            else{
                return 0
            }
          }
      }
    }//Y

    //STEP 6 - MAXIMUM PLATE PROJECTION BEYOND COLUMN
    Yp(){
        return Math.max(this.m, this.n)
    }

    //STEP 7 - ACTUAL BEARING STRESS
    fp(){
        return this.Pr/(this.BP*this.Y())
    }

    //STEP 8 - MOMENT IN PLATE AT FACE OF COLUMN
    Mp(){
        let f = this.e() > this.ec() ? this.fpmax() : this.fp()
        
        if(this.Y() >= this.Yp()){
            return f*Math.pow(this.Yp(),2)/2
        }
        else{
            return f*this.Y()*(this.Yp()-this.Y()/2)
        }
   }

   Mt(){
        let f = this.NP/2 - this.de
        let x = f - this.NS/2

        return this.Tr()*x/this.BS
   }

    //STEP 9 - BASE PLATE THICKNESS
    tp(){
        let M = Math.max(this.Mp(), this.Mt())
        
        return Math.pow((4*M)/(this.phiF()*this.Fyp), 0.5)
    }

    //STEP 10 - MAXIMUM TENSION FORCE
    Tr(){
        return this.e() > this.ec() ? this.qmax()*this.Y()-this.Pr : 0
    }

    forceParams(){
        return{
            Tr : this.Tr(),
            Vr : this.Vr,
            fTn : this.fTn(),
            fVn : this.fVn(),
            e : this.e(),
            ec : this.ec(),
        }
    }

    plateParams(){
        return{
            A1 : this.A1(),
            m : this.m,
            n : this.n,
            Y : this.Y(),
            Yp : this.Yp(),
            Mp : this.Mp(),
            Mt : this.Mt(),
        }
    }

    pierParams(){
        return{
            A2 : this.A2(),
            phiBrg : this.phiBrg(),
            fpmax : this.fpmax(),
            fp : this.fp(),
            qmax : this.qmax(),
        }
    }

    columnParams(){
        return{
            NS : this.NS,
            BS : this.BS,
        }
    }

    
    //-------------------------------------------------
    //ANCHOR 
    //-------------------------------------------------
    fTbn(){
        return this.phiTb()*this.Fnt*this.Ab
    }

    fVbn(){
        return this.phiVb()*this.Fnv*this.Ab
    }

    fTn(){
        return this.fTbn()*this.Nb
    }

    fVn(){
        return this.fVbn()*this.Nb*2
    }

    anchorParams(){
        return{
            db : this.db,
            Ab : this.Ab,
            Fu : this.Fu,
            Fnt : this.Fnt,
            Fnv : this.Fnv,
            phi_T : this.phiTb(),
            phi_V : this.phiVb(),
            fTbn : this.fTbn(),
            fVbn : this.fVbn()
        }
    }

   
   
   
  } //CLASS