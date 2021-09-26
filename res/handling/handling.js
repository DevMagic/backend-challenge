exports.handling = (args,maxs=[])=>{
    const erros = Object.keys(args).map((key,index)=>{
       if(!args[key]){
       
           return `Field ${key} cannot be empty!`
       }
       else if(String(args[key].length) > maxs[index]){
    
           return `Field ${key} must be less than ${maxs[index]} characters!`
       }
       
   }).filter(curr => !!curr)

   return erros
}

exports.isValid = (a,b)=>{
    if(isNaN(a) || isNaN(b)){
        return "Invalid number"
    }
    if(a>b){
        return "Minimum value cannot be greater than maximum value"
    }
    return true
}