export default class Foundation {
    constructor({ fc = 3000, Fy=60000}){
        this.fc = fc
        this.Fy = Fy
        this.rho_c = 150
        this.phi_v = 0.75
        this.phi_p = 0.65
        this.phi_brg = 0.6

        this.LLF = 1.6              //LATERAL LOAD FACTOR
        this.DLF = 1.2              //DEAD LOAD FACTOR
        this.ELF = 1.6              //EARTH LOAD FACTOR
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