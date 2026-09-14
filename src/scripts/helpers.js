import Resources from "../scripts/resources";

const CheckPermission = (user, permission) => {
    return user.level === 'admin' || ((user.level === 'accounting' || user.level === 'operator') && user.rules && user.rules.indexOf(permission) >= 0);
};

const PriceFormat = (value) => {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const SearchFormat = (value) => {
    return value.split('/').join('').split('ك').join('ک').split('ي').join('ی');
    //return value.split('/').join('').split('ك').join('ک').split('ی').join('ي');
}

const getReceptionStatus = (value) => {
    console.log("getReceptionStatus : ", value)
        if(value == "0"){
            return Resources.confirm_transfer_to_accepted
        }
        if(value == "1"){
            return Resources.transfer_to_repair_stage
        }
        if(value == "2"){
            return Resources.issuing_diagnosis_card
        }
        if(value == "3"){
            return Resources.send_to_checkout_page
        }     
        if(value == "4"){
            return Resources.wait_to_confirm
        }  
        if(value == "5"){
            return Resources.be_confirm
        } 
        if(value == "6"){
            return Resources.be_send
        } 
}


const getItemStatus = (value) => {
        if(value == "new"){
            return Resources.new
        }
        if(value == "broken"){
            return Resources.broken
        }
        if(value == "confused"){
            return Resources.confused
        }

}
export { CheckPermission, PriceFormat, SearchFormat, getReceptionStatus, getItemStatus};