export function rebar(size){
    switch (size){
        case '#3':
            return {Wt:0.376,d:0.375,A:0.11}
            break
        case '#4':
            return {Wt:0.668,d:0.5,A:0.20}
            break
        case '#5':
            return {Wt:1.043,d:0.625,A:0.31}
            break
        case '#6':
            return {Wt:1.502,d:0.75,A:0.44}
            break
        case '#7':
            return {Wt:2.044,d:0.875,A:0.6}
            break
        case '#8':
            return {Wt:2.67,d:1,A:0.79}
            break
        case '#9':
            return {Wt:3.40,d:1.128,A:1}
            break
        case '#10':
            return {Wt:4.303,d:1.27,A:1.27}
            break
        case '#11':
            return {Wt:5.313,d:1.41,A:1.56}
            break
        case '#14':
            return {Wt:7.65,d:1.693,A:2.25}
            break
        case '#18':
            return {Wt:13.6,d:2.257,A:4}
            break
    }//SWITCH
}//EXPORT DEFAULT


export function flexureCapacity({b=12, h=25, rebarSize="#5", stirrupSize="#3", rebarQty=2, rebarSpa=0, cov=1.5, Fy=60000, fc=3000}){
    let Es = 29000
    let d = rebarSpa == 0 ? h - cov - rebar(stirrupSize).d - rebar(rebarSize).d/2 : h - cov - rebar(rebarSize).d/2
    let Ast = rebarSpa == 0 ? rebar(rebarSize).A * rebarQty : rebar(rebarSize).A*(12/rebarSpa)

    let a = (Ast*Fy)/(0.85*fc*b)
    let b1 = Math.max(0.85-((fc-4000)/1000)*0.05,0.65)
    let c = a/b1
    let et = ((d-c)/c)*0.003
    let phi = et >= 0.005 ? 0.9 : 0.483 + 83.33*et

    let rho = Ast/(b*d)
    let rho_min = Math.max(3 * Math.pow(fc, 0.5) / Fy, 200 / Fy)
    let rho_bal = 0.85 * b1 * (fc / Fy) * 87000 / (87000 + Fy)
    let rho_max = (0.003 + Fy / Es) / (rho_bal / 0.008)

    let Mn = Ast*Fy*(d - a/2)/12000
    let fMn = phi * Mn

    return{d,Ast,a,b1,c,et,phi,rho,rho_min,rho_bal,rho_max,Mn,fMn}
    //return phi*Ast*Fy*(d - a/2)/12000
}

export function flexureRebarArea({Mu=100, rebarSize="#5", stirrupSize="", b=12, h=12, cov=1.5, fc=4000, Fy=60000}){
    let Es = 29000
    let ds = stirrupSize == "" ? 0 : rebar(stirrupSize).d
    let db = rebar(rebarSize).d
    let d = h - cov - ds - db/2
    let b1 = Math.max(0.85-((fc-4000)/1000)*0.05,0.65)
    let R = (Mu*12000)/(0.9*b*Math.pow(d,2))
    let m = Fy/(0.85*fc)
    
    let rho_min = Math.max(3 * Math.pow(fc, 0.5) / Fy, 200 / Fy)
    let rho_bal = 0.85 * b1 * (fc / Fy) * 87000 / (87000 + Fy)
    let rho_max = (0.003 + Fy / Es) / (rho_bal / 0.008)
    let rho = 1/m * (1 - Math.pow((1-(2*m*R)/Fy),0.5))

    let A = Math.max(rho,rho_min)*b*d

    let Nb = A/rebar(rebarSize).A
    let Sb = (b - 3 - 2*ds - db)/(Nb-1)

    return {Mu,A,Nb,Sb,ds,db,d,rho,R,m,rho_min,rho_bal,rho_max}

    //return Math.max(rho,rho_min)*b*d

    //return Mu/(4*d)
}

export function Ld({rebarSize="#5",fc=3000}){
    let sig_s = rebar(rebarSize).d <= 0.625 ? 20 : 25
    let sig_t = 1
    let sig_e = 1
    let Fy = 60000
    let k1 = Fy*sig_t*sig_e
    let lambda = 1
    let k2 = sig_s*lambda*Math.pow(fc,0.5)

    return Math.min((k1/k2)*rebar(rebarSize).d, 12)
}

export function Ldh({rebarSize="#5",fc=3000,cov=1.5}){
    let sig_e = 1
    let Fy = 60000
    let lambda = 1
    let k1 = 0.02*Fy*sig_e*rebar(rebarSize).d/(lambda*Math.pow(fc,0.5))
    let RF1 = cov > 2.5 ? 0.7 : 1
    let RF2 = 1

     return Math.max(k1,8*rebar(rebarSize).d,6)*RF1*RF2
}

export function onewayShearCapacity({b=12, h=25,  stirrupSize="",  rebarSize="#5",  cov=1.5, fc=3000}){
    let ds = stirrupSize == "" ? 0 : rebar(stirrupSize).d
    let db = rebar(rebarSize).d
    let d = h - cov - ds - db/2
    let Vc = 2*Math.pow(fc,0.5)*b* d/1000
    let phi_v = 0.75
    return phi_v*Vc 
}//NOMINAL ONE WAY SHEAR CAPACITY

export function punchingShearCapacity({h=25,lp=18, bp=12,  stirrupSize="",  rebarSize="#5",  cov=1.5, fc=3000}){
    let ds = stirrupSize == "" ? 0 : rebar(stirrupSize).d
    let db = rebar(rebarSize).d
    let d = h - cov - ds - db/2
    let bo = 2*((lp + d) + (bp + d))
    let Vc = 4*Math.pow(fc,0.5)*bo* d/1000
    let phi_v = 0.75
    return phi_v*Vc 
}//NOMINAL ONE WAY SHEAR CAPACITY



export function fVn({b=12, h=25,  rebarSize="#5", stirrupSize="#3", stirrupSpa=12,noStirrupLegs =2, cov=1.5, Fy=60000, fc=3000}){
    let d = h - cov - rebar(stirrupSize).d - rebar(rebarSize).d/2
    let Vc = 2*Math.pow(fc,0.5)*b* d/1000
    let Asv = rebar(stirrupSize).A * noStirrupLegs * (12/stirrupSpa)
    let Vs = stirrupSpa > 0 ? Math.min(Asv*(Fy/1000)*d/stirrupSpa, 8*Math.pow(fc,0.5)*b*d) : 0
    let phi_v = 0.75
    return phi_v*(Vc + Vs)
}//NOMINAL ONE WAY SHEAR CAPACITY

export function Stemp({rebarSize="#5",type="Wall",h=8,orientation="Vertical"}){
    let b = 12
    let Asr = 0
    let Asa = rebar(rebarSize).A
    let db = rebar(rebarSize).d
    switch(type){
        case "Wall":
            if(h<=8){
                Asr = db <= 0.625 ? 0.002*b*h : 0.0025*b*h
            }
            else{

            }
            break
        case "Slab":
            Asr = 0.0018 * b * h
            return Math.min((Asp/Asr)*12, 5*h, 18)
            break
        case "Footing":
            Asr = 0.0018 * b * h
            return Math.min((Asp/Asr)*12, 5*h, 18)
            break
    }

}