import SawnLumber from '@/classes/wood/clsSawnLumber'
import {find} from 'lodash'
import {ArrayMin} from '@/library/mathLib'

export default class MSR extends SawnLumber{
    constructor({size, noPly, species, Lu, Lx, Ly, method, duration,moisture,temperature,bearing,incision,flat}){
		super({ size, noPly, species, method, Lu, Lx, Ly, duration, moisture, temperature, bearing, incision, flat})
		this.L = L*12
       
        
    }//CONSTRUCTOR
    
    

}//CLASS