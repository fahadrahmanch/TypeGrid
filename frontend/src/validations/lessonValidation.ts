export function titleValidation(title: string) {
  if (!title.trim()) return "title is required";
  if (title.trim().length < 3) return "title must be at least 3 characters";
  return "";
}

export function DescriptionValidation(Description:string){
    if(!Description.trim())return "Description is required";
    if(Description.trim().length < 10)return "Description must be at least 10 characters";
    return "";
}

export function LevelValidation(level:string){
    if(!level.trim())return "Level is required";
    return "";
}

export function WpmValidation(wpm:string){
    if(!wpm.trim())return "Wpm is required";
    return "";
}
export function accuracyValidation(accuracy:string){
    if(!accuracy.trim())return "Accuracy is required";
    return "";
}
export function CategoryValidation(category:string){
    if(!category.trim())return "Category is required";
    return "";
}
export function textValidation(text:string){
    if(!text.trim())return "Text is required";
    if(text.trim().length < 10)return "Text must be at least 10 characters";
    return "";
}