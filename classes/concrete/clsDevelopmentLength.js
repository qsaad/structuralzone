import Concrete from '@/classes/concrete/clsConcrete'
import {rebar} from '@/library/concreteLib'

export default class DevelopmentLength extends Concrete {
    constructor({ rebarSize="#5" , fc=3000, Fy=60 , cov, rebarSpa = 12, location="Top", coating="Uncoated", concreteType="NWT"}) {
        super({ fc })
        this.Fy = Fy * 1000
        this.rebarSize = rebarSize
        this.rebarSpa = rebarSpa
        this.cov = cov
        this.location = location
        this.coating = coating
        this.concreteType = concreteType
        this.Ktr = 0

    } // CONSTRUCTOR

    db(){
        return rebar(this.rebarSize).d   
      }//DIAMETER OF REBAR

    Cb(){
        return Math.min(this.cov + this.db()/2, this.rebarSpa/2)
    }

    sig_t(){
        return this.location == 'Top' ? 1.3 : 1
    }

    sig_e(){
        return this.coating == 'Coated' ? 1.2 : 1
    }

    sig_s(){
        return this.db() <= 0.625 ? 0.8 : 1
    }

    lambda(){
        return this.concreteType == 'NWT' ? 1 : 1.3
    }

    Ld(){
        let k1 = this.Fy*this.sig_t()*this.sig_e()*this.sig_s()
        let k2 = 25*this.lambda()*Math.pow(this.fc,0.5)
        return (k1/k2)*this.db()
    }

    // Ld(){
    //     let k1 = this.sig_t()*this.sig_e()*this.sig_s()*this.lambda()
    //     let k2 = (this.Cb()+this.Ktr)/this.db()
    //     return (3/40)*(this.Fy/Math.pow(this.fc,0.5))*(k1/k2)*this.db()
    // }

    Ldc(){
        let k1 = 0.02*this.Fy*this.db()/(this.lambda()*Math.pow(this.fc,0.5))
        let k2 = 0.0003*this.Fy*this.db()
        return Math.min(k1, k2)
    }

    Ldh(){
        let k1 = 0.02*this.Fy*this.sig_e()*this.db()/(this.lambda()*Math.pow(this.fc,0.5))
        let RF1 = this.cov > 2.5 ? 0.7 : 1
        let RF2 = 1

        return Math.max(k1,8*this.db(),6)*RF1*RF2
    }
  

  } //CLASS