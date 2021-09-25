import React from 'react';
import * as Assist from './HelperFunctions'
import queryString from "query-string";

export default class ThankYou extends React.Component{
    constructor(props){
        super(props);
        this.state = {}
        this.enquiryId = Assist.loadAndGetEnquiryId();

        Assist.removeCss('quoteCss');
        Assist.removeCss('proposalCss');
    }

    componentDidMount = () => {
        Assist.GetProposalData().then(resp => {
            this.setState({
                proposalData: resp.data,
            })
        });

        Assist.GetPetDetails().then(resp => {
            this.setState({
                PetDetails: resp.data
            })
        })
    }

    random = (length, chars) => {
        var result = '';
        for (var i = length; i > 0; --i) 
            result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    render() {
        if (!this.state.proposalData || !this.state.PetDetails)
            return <h1 style={{textAlign: 'center'}}>LOADING...</h1>

        const bookingId = this.random(10, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        const policyNo = this.random(10, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');

        return (
            <div className="inner-pages thanks-page">
            <header>
            <div className="container">
                <a className="logo" href><img src="images/pb-logo.svg" className="img-fluid" alt="Policybazaar" /></a>
            </div>
            </header>
            <div className="thanks-section">
            <div className="container ">
                <div className="row">
                <div className="col-sm-8">
                    <div className="left_section">
                    <div className="great_job">
                        <img src="images/checkmark.svg" className="icon" />
                        <div className="text">
                        <h2>Great job! You’re now insured</h2>
                        <p>Your policy has also been sent over email. <strong>Booking ID is {bookingId}</strong></p>
                        </div>
                    </div>
                    <div className="policy_details">
                        <div className="headings">Policy details</div>
                        <div className="inner">
                        <ul className="details_list clearfix">
                            <li className="logo"><img src={`https://static.pbcdn.in/car-cdn/rct/images/${this.state.proposalData.SupplierID}.png?v=2`} /></li>
                            <li><p><span>Policy number</span>{policyNo}</p></li>
                            <li><p><span>Premium</span>₹ {this.state.proposalData.FinalPremium}</p></li>
                            <li><p><span>Cover amount</span>₹ 2,00,000</p></li>
                            <li><p><span>Pet covered</span>{this.state.PetDetails.PetName}</p></li>
                        </ul>
                        </div>
                    </div>
                    <div className="text-right">
                        <a href className="policy_links">Download policy</a>
                        <a href className="policy_links">View Policy details</a>
                    </div>
                    <div className="say-hello">
                        <div className="headings">Say hello to your relationship manager</div>
                        <div className="profile">
                        <div className="text">
                            <div className="name">Priyank Sharma</div><div className="status">
                            Pet Insurance Expert</div>
                            <p>Priyank can speak Hindi &amp; English. He has 5 year of experience in the field of health insurance.</p>
                            <ul className="btn-list">
                            <li><button className="blue-button"><img src="images/call.svg" /> Call Priyank @9650601895</button></li>
                            <li><button className="whats-app"><img src="images/whats-app.svg" />Connect on Whatsapp</button></li>
                            </ul>
                            <a href>*You can also connect with your Priyank using Policybazaar app</a>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="col-sm-4">
                    <img src="images/my-dog-and-me.gif" className="img-fluid" />
                    <div className="rate-us">
                    <div className="text-heading">
                        <img src="images/star.svg" />
                        <div className="right-text">
                        <div className="headings">Would you like to rate us?</div>
                        <p>It will help us grow</p>
                        </div>
                    </div>
                    <ul className="emojis">
                        <li className="text-center"><img src="images/meh.svg" className="img-fluid" /><p>Meh!</p></li>
                        <li className="text-center"><img src="images/loved.svg" className="img-fluid" /><p>Loved it!</p></li>
                    </ul>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        )
    }
}