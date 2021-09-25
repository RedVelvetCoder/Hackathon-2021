import React from 'react';
import * as Assist from './HelperFunctions'

export default class Quotes extends React.Component{
    constructor () {
        super();
        this.state = {
            allPlans: [],
            addonPlans: [],
            defaultPlans: [],
            showPG: false,
        }
        this.enquiryId = 0;
        this.selectedAddons = [];
        this.allAddons = [
            {   text: 'Mortality', key: 'Mortality'  },
            {   text: 'OPD expenses Cover', key: 'OPDExpense'  },
            {   text: 'Terminal Illness', key: 'TerminalIllness'  },
            {   text: 'Theft/Loss/Straying Cover', key: 'TheftPremium'  },
            {   text: 'Third Party Liability Cover', key: 'ThirdParty'  },
            {   text: 'Long Term Care', key: 'LongTermCare'  }
        ];
        
        this.enquiryId = Assist.loadAndGetEnquiryId();
        Assist.removeCss('proposalCss');
        Assist.removeCss('thanksCss');
    }

    componentDidMount = () => {
        Assist.GetQuotes().then(resp => {
            this.setState({
                allPlans: resp.data,
                defaultPlans: resp.data.filter(a => a.PlanID == 12)
            })
        });

        Assist.GetPetDetails().then(resp => {
            this.setState({
                PetDetails: resp.data
            })
        })
    }

    onBuyPlan = (plan) => {
        const payLoad = {
            Enquiry: this.enquiryId,
            PlanId: plan.PlanID,
            SupplierId: plan.SupplierId
        }

        Assist.BuyPlan(payLoad).then(resp => {
            this.setState({
               showPG: true 
            })
            setTimeout(() => {
                window.location = window.location.origin + "/proposal?e=" + this.enquiryId
            }, 3000)
        })
    }

    renderPlanCard = (planData) => {
        var textArr = this.selectedAddons.length === 0 ? [] : this.allAddons.map(a => {
                        if (this.selectedAddons.includes(a.text) && planData[a.key] > 0)
                            return a.text;
                        else
                            return null
                    })

        return (
            <div className="plan-card">
                <div className="logo ">
                <img src={`https://static.pbcdn.in/car-cdn/rct/images/${planData.SupplierId}.png`} className="img-fluid" />
                {/* <a className="links">Coverage</a> */}
                </div>
                <div className="addons">
                <ul>
                    <li>Hospitalisation Cover</li>
                    <li>Pre and Post-Surgery Expenses</li>
                    <li>Accidental Fracture</li>
                    {textArr.length === 0 ? null : <li>{textArr.filter(a=>a).join(', ')}</li>}
                </ul>
                </div>
                <div className="cover_amount "><span>Cover</span>₹2,00,000</div>
                <div className="btn-wrap ">
                <div className="price-btn" onClick={()=>this.onBuyPlan(planData)}>₹{planData.FinalPremium}</div>
                </div>
            </div>
        )
    }

    manageAddon = (e, value) => {
        if (e.target.checked)
            this.selectedAddons.push(value);
        else
            this.selectedAddons = this.selectedAddons.filter(a => a != value);

        if (this.selectedAddons.length == 0) {
            this.setState({
                addonPlans: []
            })
            return;
        }

        var plans = []

        this.state.allPlans.filter(a => a.PlanID != 12).map(plan => {
            var allowed = false;
            // if (plan.PlanID == 9)
            //     debugger;

            for (var i=0; i < this.allAddons.length; i++) {
                if (this.selectedAddons.includes(this.allAddons[i].text)) {
                    if (plan[this.allAddons[i].key] > 0)
                        allowed = true;
                    else
                        allowed = false;
                }

                if (this.selectedAddons.includes(this.allAddons[i].text)==false){
                    if (!plan[this.allAddons[i].key])
                        allowed = true;
                    else
                        allowed = false;
                }
                if (!allowed) break;
            }
            if (allowed)
                plans = plans.concat(plan);
        })

        this.setState({
            addonPlans: plans
        })
    }

    renderAddonDOM = (heading, desc) => {
        return (
            <li>
                <label className="custom_radio">
                <input type="checkbox" name="adons" onChange={(e) => this.manageAddon(e, heading)}/>
                <div className="box">
                    <span className="circle" />
                    <div className="headings">{heading}</div>
                    <p className="margin-0">{desc}</p>
                </div>
                </label>
            </li>
        )
    }

    renderPG = () => {
        return (<div className="inner-pages quote-page">
                {Assist.getHeaderDOM()}
                <div className="payment">
                    <h2>Hola, we are doing your payment, but only for today!</h2>
                    <br/><br/>
                    <h4>You will be redirected to proposal page anytime now...</h4>
                </div>
            </div>
        )
    }

    render() {
        if (this.state.showPG) {
            return this.renderPG();
        }

        if (!this.state.PetDetails || this.state.allPlans.length == 0)
            return <h1>LOADING...</h1>

        const plansToShow = this.selectedAddons.length > 0 ? this.state.addonPlans : this.state.defaultPlans;

        return (
            <div className="inner-pages quote-page">
                {Assist.getHeaderDOM()}
              <div className="quote-section">
                <div className="container clearfix">
                  <div className="left_panel">
                    <div className="inner">
                      <div className="headings">Add ons</div>
                      <p className="margin-0">You can add additional benefits in your Plan</p>
                      <div className="dotted-line" />
                      <ul className="addons_list">
                        <li>
                          <div className="tag">Popular</div>
                          {this.renderAddonDOM('OPD expenses Cover', 'Coverage for OPD expenses for any bodily injury arising out of accidents.')}
                        </li>
                        {this.renderAddonDOM('Mortality', 'Lumpsum payout if your dog dies because of an illness or accident or as a result…')}
                        {this.renderAddonDOM('Terminal Illness', 'Lumpsum payout If your dog is diagnosed from any of the Terminal diseases listed.')}
                        {this.renderAddonDOM('Theft/Loss/Straying Cover', 'If your dog is lost or stolen or strayed and no recovery having been made after 45 days')}
                        {this.renderAddonDOM('Third Party Liability Cover', 'If you become legally liable to pay for any bodily injury and/ or property damage…')}
                        {this.renderAddonDOM('Increasing Life Cover Plans', 'Cover amount increases every year while premium you pay remains constant')}
                        {this.renderAddonDOM('Long Term Care', 'Lumpsum payout If your dog is diagnosed with any of the illnesses listed below')}
                      </ul>
                    </div>
                  </div>
                  <div className="right_panel">
                    <div className="pet_details">
                      <div className="headings">Your Pet’s details</div>
                      <div className="inner">
                        <ul className="details_list clearfix">
                          <li className="pet-img"><img src="images/pet-img.svg" /></li>
                          <li><p><span>Dog's Name</span>{this.state.PetDetails.PetName}</p></li>
                          <li><p><span>Gender</span>{this.state.PetDetails.Gender}</p></li>
                          <li><p><span>Age</span>{this.state.PetDetails.Age}</p></li>
                          <li><p><span>Breed</span>{this.state.PetDetails.Breed}</p></li>
                          <li><p><span>Pre Existing Disease</span>Not any</p></li>
                          <li><p><span>Vaccinated</span>{this.state.PetDetails.IsVaccinated ? 'Yup' : 'Nope'}</p></li>
                        </ul>
                        <div className="edit-btn"><span className="pencil_icn" />Edit</div>
                      </div>
                    </div>
                    <h2>Your plans</h2>
                    {
                        plansToShow.map(plan => {
                            return this.renderPlanCard(plan);
                        })
                    }
                    
                    <div className="banner-wrap">
                      <div className="img"><img src="images/animation.gif" className="img-fluid" /></div>
                      <div className="text">
                        <p><strong>Protect your furry friend from</strong> bodily injury and/or property damage and/or sickness and/or Death of a third party</p>
                      </div>
                      <button className="white-btn">Just for ₹ 769/year</button>
                    </div>
                  </div>{/*right_panel*/}
                </div>
              </div>
            </div>
          );
    }
}