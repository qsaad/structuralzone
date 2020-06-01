export default class Wind {
    constructor({V = 115, exposure = "B", z = 15, Kzt = 1, Kd = 0.85}){
        this.V = V
        this.Kzt = Kzt
        this.Kd = Kd
        this.z = z
        this.exposure = exposure
    }//CONSTRUCTOR

    Kz(){
        let a = 0
        let zg = 0
        switch (this.exposure) {
            case "B":
                a = 7
                zg = 1200
                break;
            case "C":
                a = 9.5
                zg = 900
                break;
            case "D":
                a = 11.5
                zg = 700
                break;
        }

        this.z <= zg ? this.z = this.z : this.z = 15;
        
        return 2.01*Math.pow(this.z/zg, 2/a)

    }//Kz
    
    params(){
        return{
            Kz : this.Kz(),
            Kd : this.Kd,
            Kzt : this.Kzt
        }
    }

    qz(){
        return 0.00256*this.Kzt*this.Kd*this.Kz()*Math.pow(this.V,2)
    }//p

    
}//CLASS