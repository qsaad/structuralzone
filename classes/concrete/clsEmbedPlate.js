//import Concrete from '@/classes/concrete/clsConcrete'
import {rebar,flexureCapacity} from '@/library/concreteLib'

export default class EmbedPlate {
    constructor({ Nu=5 , en=3 , Vu=1, ev=0, h=6, fc=4000, cracked=true, confined=true, headedStud={}, hef=4, NR=2, NC=1, SR=6, SC=6, d1=72, d2=72, d3=73, d4=72}) {
        //super({ fc })
        //LOAD
        this.Nu = Nu
        this.en = en
        this.Vu = Vu
        this.ev = ev
        //MEMBER
        this.h = h
        this.fc = fc
        this.cracked = cracked
        this.confined = confined
        //STUD
        this.ds = headedStud.d
        this.Ase = headedStud.Ase
        this.Fut = headedStud.Fut
        this.Abrg = headedStud.Abrg
        this.hef = hef
        //LAYOUT
        this.NR = NR
        this.NC = NC
        this.SR = SR
        this.SC = SC
        //EDGE DISTANCES
        this.d1 = d1
        this.d2 = d2
        this.d3 = d3
        this.d4 = d4
    } // CONSTRUCTOR

    //STEEL TENSION
    phi_n(){
        return 0.75
    } 
    n(){
        return this.NR * this.NC
    }
    fNs(){
        return this.phi_n() * this.n() * this.Ase * this.Fut
    }
   
    //STEEL SHEAR 
    phi_v(){
        return 0.65
    } 
    fVs(){
        return this.phi_v() * this.n() * this.Ase * this.Fut
    }

    //CONCRETE TENSION - BREAKOUT
    phi_cb(){
        return this.confined ? 0.75 : 0.7
    } 
    Cbs(){
        return 3.33 * Math.pow(this.fc/this.hef,0.5)
    } 
    AX(){
        return Math.min(this.d1,1.5*this.hef) + (this.NC -1)*this.SC + Math.min(this.d2,1.5*this.hef)
    } 
    AY(){
        return Math.min(this.d3,1.5*this.hef) + (this.NR -1)*this.SR + Math.min(this.d4,1.5*this.hef)
    }
    AN(){
        return this.AX() * this.AY()
    } 
    Crb(){
        return this.cracked ? 0.8 : 1
    }  
    de_min(){
        return Math.min(this.d1, this.d2, this.d3, this.d4)
    }  
    XedN(){
        return Math.min(0.7 + 0.3*(this.de_min()/(1.5*this.hef)), 1)
    }  
    XecN(){
        return Math.min(1 / (1 + (2*this.en)/(3*this.hef)),1)
    }
    fNcb(){
        return (this.phi_cb() * this.Cbs() * this.AN() * this.Crb() * this.XedN() * this.XecN())/1000
    }    

    //CONCRETE TENSION - PULLOUT
    phi_ph(){
        return 0.7
    } 
    Ccrp(){
        return this.cracked ? 0.7 : 1
    } 
    fNph(){
        return (this.phi_ph() * 11.2 * this.Abrg * this.fc * this.Ccrp() * this.n())/1000
    }   
    
    //CONCRETE SHEAR - FRONT END
    
    phi_c3(){
        return this.confined ? 0.75 : 0.7
    } 
    BED(){
        return this.d3 + (this.NR -1)*this.SR
    } 
    Vco3(){
        return 16.5*Math.pow(this.fc, 0.5)*Math.pow(this.BED(),1.33)
    } 
    X(){
        return (this.NC -1)*this.SC
    } 
    Cx3(){
        return this.X() == 0 ? 1 : Math.min(0.85 + this.X()/(3*this.BED()), this.NC)
    } 
    Ch3(){
        return this.h > 1.75*this.BED() ? 1 : 0.75*Math.pow(this.h/this.BED(),0.5)
    }
    Cev3(){
        return Math.min(1/(1 + 0.67*(this.ev/this.BED())), 1)
    } 
    Cvcr(){
        return this.cracked ? this.confined ? 1 : 0.7 : 1
    } 
    fVco3(){
        return (this.phi_c3() * this.Vco3() * this.Cx3() * this.Ch3() * this.Cev3() * this.Cvcr())/1000
    }   

    //CONCRETE SHEAR - CORNER
    SED(){
        return this.d1 + (this.NC -1)*this.SC
    } 
    Cc3(){
        return Math.min(0.7*Math.pow(this.SED()/this.BED(),0.33), 1)
    } 
    fVc3(){
        return (this.phi_c3() * this.Vco3() * this.Cc3() * this.Ch3() * this.Cev3() * this.Cvcr())/1000
    } 
    
   


    //CONCRETE SHEAR - SIDE
    phi_c1(){
        return this.confined ? 0.75 : 0.7
    } 
    Vco1(){
        return 87*Math.pow(this.fc,0.5)*Math.pow(this.d1,1.33)*Math.pow(this.ds,0.75)
    }
    Cev1(){
        return Math.min(1 - (this.ev/(4*this.d1)), 1)
    }  
    Cx1(){
        return (this.NC*this.SC)/(2.5*this.d1) + 2
    }  
    Cy1(){
        return Math.pow(this.NR*((this.NR-1)*this.SR),0.25)/(0.6*this.d1)+0.15
    } 
    fVc1(){
        return (this.phi_c1() * this.Vco1() * this.Cx1() * this.Cy1() * this.Cev1() * this.Cvcr())/1000
    }  
    
   

    //
    fNn(){
        return Math.min(this.fNs(), this.fNcb(), this.fNph())
    }

    fVn(){
        return Math.min(this.fVs(), this.fVco3(), this.fVc3(), this.fVc1())
    }
   

   

    steelParams(){
      return {
        Ase : this.Ase,
        n : this.n(),
        Fut : this.Fut,
        phi_n : this.phi_n(),
        fNs : this.fNs(),
        phi_v : this.phi_v(),
        fVs : this.fVs(),
      }
    }

    breakoutParams(){
        return {
            phi_cb : this.phi_cb(),
            Cbs : this.Cbs(),
            AX : this.AX(),
            AY : this.AY(),
            AN : this.AN(),
            Crb : this.Crb(),
            de_min : this.de_min(),
            XedN : this.XedN(),
            XecN : this.XecN(),
            fNcb : this.fNcb(),
        }
    }

    pulloutParams(){
        return {
            phi_ph : this.phi_ph(),
            Abrg : this.Abrg,
            Ccrp : this.Ccrp(),
            fNph : this.fNph(),
        }
    }

    blowoutParams(){
        return {
          //d : this.d(),
        }
    }

    frontParams(){
        return {
            phi_c3 : this.phi_c3(),
            BED : this.BED(),
            Vco3 : this.Vco3(), 
            X  : this.X(),
            Cx3 : this.Cx3(),
            Ch3 : this.Ch3(),
            Cev3 : this.Cev3(),
            Cvcr : this.Cvcr(), 
            fVco3 : this.fVco3(), 
        }
    }

    cornerParams(){
        return {
            SED : this.SED(),
            Cc3 : this.Cc3(),
            fVc3 : this.fVc3(),
        }
    }

    sideParams(){
        return {
            phi_c1 : this.phi_c1(),
            Vco1 : this.Vco1(),
            Cev1 : this.Cev1(),
            Cx1 : this.Cx1(),
            Cy1 : this.Cy1(),
            fVc1 : this.fVc1(),
        }
    }
      

  } //CLASS