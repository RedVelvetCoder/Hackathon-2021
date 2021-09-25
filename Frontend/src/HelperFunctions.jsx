import axios from "axios";
import queryString from "query-string";

const baseUrl = 'https://car2uat.policybazaar.com/api/';
var enquiryId = 0;

export function get(path) {
    return axios.get(baseUrl+path);
}

export function GetBreedList(animalType) {
    const path = 'Pet/GetBreeds?PetID='+animalType;
    return get(path);
}

export function post(path, payload) {
    return axios.post(baseUrl+path,payload);
}

export function InsertPreQuoteDetails(payload) {
    const path = 'Pet/InsertPreQuoteDetails';
    return post(path, payload);
}

export function saveEnquiryId(id) {
    enquiryId = id;
}

export function GetQuotes() {
    const path = 'Pet/GetQuotes?Enquiry='+enquiryId;
    return get(path)
}

export function GetProposalData() {
    const path = 'Proposal/GetProposalData?Enquiry='+enquiryId;
    return get(path)
}

export function getHeaderDOM() {
    return <header>
    <div className="container">
      <a className="logo"><img src="images/pb-logo.svg" className="img-fluid" alt="Policybazaar" /></a>
    </div>
  </header>
}

export function InsertPetName(payLoad) {
    const path = 'Pet/InsertPetName';
    return post(path, payLoad)
}

export function loadAndGetEnquiryId() {
    var queryParamerters = queryString.parse(window.location.search)
    if (queryParamerters && queryParamerters.e) {
        saveEnquiryId(queryParamerters.e)
        return queryParamerters.e
    }
}

export function SaveVisitorDetails(payLoad) {
    const path = 'Proposal/SaveVisitorDetails';
    return post(path, payLoad)
}

export function removeCss(id) {
    var node = document.getElementById(id);
    if (node != null)
      node.parentNode.removeChild(node);
}

export function GetPetDetails() {
    const path = 'Pet/GetPetDetails?EnquiryID='+enquiryId;
    return get(path)
}

export function BuyPlan(payLoad) {
    const path = 'Proposal/BuyPlan';
    return post(path, payLoad)
}