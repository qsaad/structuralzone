export default class BasePressure {
    constructor({ P=100, M=0, B=6, L=6}){
        this.P = P
        this.M = M
        this.B = B
        this.L = L
    }

    //AREA (ft^2)
    A(){
        return this.B * this.L
    }
    //SECTION MODULUS (ft^3)
    S(){
        return this.B * Math.pow(this.L,2)/6
    }
    //LOAD ECCENTRICITY (ft)
    e(){
        return this.M / this.P
    }
    //CONTACT LENGTH (ft)
    x(){
        if(this.e() < this.L/6){
            return this.L
        }
        else{
            return 3*(this.L/2 - this.e())
        }
    }
    //BASE PRESSURE (ksf)
    qp(){
        return this.P/this.A()
    }
    qm(){
        return this.M/this.S()
    }
    q(){
        if(this.e() < this.L/6) {
            
            return this.P/this.A() + this.M/this.S()
        }
        else{
            return (2*this.P)/(this.B * this.x())
        }
    }
    

}//CLASS