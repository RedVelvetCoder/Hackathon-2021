import React from 'react';
import * as Assist from './HelperFunctions'

export default class Proposal extends React.Component{
    constructor () {
        super();
        this.state = {
        }   
        this.enquiryId = Assist.loadAndGetEnquiryId();

        this.addonsDict = [
            {   text: 'Mortality', key: 'Mortality'  },
            {   text: 'OPD expenses Cover', key: 'OPDExpense'  },
            {   text: 'Terminal Illness', key: 'TerminalIllness'  },
            {   text: 'Theft/Loss/Straying Cover', key: 'TheftPremium'  },
            {   text: 'Third Party Liability Cover', key: 'ThirdParty'  },
            {   text: 'Long Term Care', key: 'LongTermCare'  }
        ];

        Assist.removeCss('quoteCss');
        Assist.removeCss('thanksCss');
    }

    componentDidMount = () => {
        Assist.GetProposalData().then(resp => {
            this.setState({
                proposalData: resp.data,
            })
        });
    }

    makePolicy = () => {
        const payLoad = {
            Enquiry: this.enquiryId,
            OwnerName: document.getElementById('owner').value,
            OwnerAddress: document.getElementById('address').value,
            Email: document.getElementById('email').value,
            Mobile: document.getElementById('mobile').value,
        }

        Assist.SaveVisitorDetails(payLoad).then(resp => {
            window.location = window.origin + "/thanks?e="+this.enquiryId
        });
    }

    render() {
        if (!this.state.proposalData)
            return <h1 style={{textAlign: 'center'}}>LOADING...</h1>

        const proposal = this.state.proposalData;            
        const addonsArr = proposal.PlanAddons ? proposal.PlanAddons.split(',') : [];

        return (
                <div className="inner-pages proposal-page">
                  {Assist.getHeaderDOM()}
                  <div className="proposal-section">
                    <div className="container clearfix">
                      <div className="left_panel">
                        <div className="payment_details inner">
                          <h2>Payment details</h2>
                          <div className="dotted-line" />
                          <div className="row">
                            <div className="col-6 logo"><img src={`https://static.pbcdn.in/car-cdn/rct/images/${this.state.proposalData.SupplierID}.png?v=2`} alt='default' /></div>
                            <div className="col-6 detail">
                              <p><span>Order No.</span>{this.state.proposalData.ProposalNo}</p>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6 detail">
                              <p><span>Cover</span>₹2,00,000</p>
                            </div>
                            <div className="col-6 detail">
                              <p><span>Amount paid</span>₹{this.state.proposalData.FinalPremium}</p>
                            </div>
                          </div>
                          <div className="plan_feature_item dropdowns_wrap">
                            <label htmlFor="feature_drop" className="feature_dropdowns clickable">
                              <input type="checkbox" id="feature_drop" />
                              <span className="arrow">{addonsArr.length>0?addonsArr.length:'No'} Addons</span>
                              {addonsArr.length === 0? null :
                                <div className="dropdowns">
                                    <h4>Addons included</h4>
                                    <ul className="addons">
                                    {addonsArr.map((a,i) => {
                                            const text = this.addonsDict.filter(b=>b.key===a)[0].text
                                            return <li key={i}>{text}</li>
                                        })
                                    }
                                    </ul>
                                </div>}
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="right_panel">
                        <div className="proposal-form">
                          <h2>Proposal form</h2>
                          <div className="separator">
                            <span>Fill the below proposal form</span>
                          </div>
                          {/* <div className="other-text">These details are required for issuing your policy.</div> */}
                          <div className="margin-btnm30">
                            <div className="form-group ">
                              <div className="subtitle">Gender</div>
                              <div className=" row ">
                                <div className="col-sm-2 col-5">
                                  <label className="custom_radio" htmlFor="male">
                                    <input type="radio" name="gender" id="male" defaultChecked />
                                    <span className="circle" />
                                    <span className="text">Male</span>
                                  </label>
                                </div>
                                <div className="col-sm-2 col-5">
                                  <label className="custom_radio" htmlFor="female">
                                    <input type="radio" name="gender" id="female" />
                                    <span className="circle" />
                                    <span className="text">Female</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-group col-6">
                              <div className="floating_label_wrap">
                                <input type="text" placeholder="Enter your full name" className="form-control floating_input" id="owner"/>
                                <label className="floating_label">Enter your full name</label>
                                {/* <div className="check_mark" /> */}
                              </div>
                            </div>
                            <div className="form-group col-6">
                              <div className="floating_label_wrap">
                                <input type="text" placeholder="Enter date of birth" className="form-control floating_input" />
                                <label className="floating_label">Enter date of birth</label>
                              </div>
                            </div>
                            <div className="form-group col-6">
                              <div className="floating_label_wrap">
                                <input type="text" placeholder="Enter email ID" className="form-control floating_input" id="email"/>
                                <label className="floating_label">Enter email ID</label>
                              </div>
                            </div>
                            <div className="form-group col-6">
                              <div className="floating_label_wrap">
                                <input type="text" placeholder="Enter mobile number" className="form-control floating_input" id="mobile"/>
                                <label className="floating_label">Enter mobile number</label>
                              </div>
                            </div>
                            <div className="form-group col-12">
                              <div className="floating_label_wrap ">
                                <input type="text" placeholder="Enter address" className="form-control floating_input" id="address"/>
                                <label className="floating_label">Enter address</label>
                              </div>
                            </div>
                            <div className="form-group col-6">
                              <div className="floating_label_wrap ">
                                <input type="text" placeholder="Enter Pin code" className="form-control floating_input" />
                                <label className="floating_label">Enter Pin code</label>
                              </div>
                            </div>
                            <div className="form-group col-6">
                              <div className="floating_label_wrap ">
                                <input type="text" placeholder="Enter Pin code" className="form-control floating_input" />
                                <label className="floating_label">Enter MICR Tag</label>
                                {/* <select className="form-control">
                                  <option>Select State</option>
                                  <option>Andhra Pradesh</option>
                                  <option>Arunachal Pradesh</option>
                                  <option>Assam</option>
                                  <option>Chhattisgarh</option>
                                  <option>Goa</option>
                                  <option>Gujarat</option>
                                  <option>Himachal Pradesh</option>
                                  <option>Karnataka</option>
                                </select> */}
                              </div>
                            </div>
                            <div className="col-12 text-center">
                              <button className="blue-button" onClick={()=>this.makePolicy()} style={{fontSize:'large'}}>Generate my policy</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
    }
}