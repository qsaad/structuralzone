export default class Concrete {
    constructor({ fc = 3000}){
        this.fc = fc
        this.phi_v = 0.75
        this.phi_p = 0.65
        this.phi_brg = 0.6
    }

    //CONCRETE MODULUS OF ELASTICITY (ksi)
    Ec(){
        return 57*Math.pow(this.fc,0.5)
    }
    //STEEL MODULUS OF ELASTICITY
    Es(){
        return 29000
    }
    //MODULAR RATIO
    n(){
        return this.Es()/this.Ec()
    }
    //MODULUS OF RUPTURE
    Fr(){
        return 7.5*Math.pow(this.fc,0.5)
    }
    //POISSON RATIO
    nu(){
        return 0.2
    }
    //SHEAR MODULUS (ksi)
    Gc(){
        return this.Ec()/2*(1 + this.nu())
    }

}//CLASS