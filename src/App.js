import React from 'react';
import Quotes from './Quotes'
import Proposal from './Proposal'
import ThankYou from './ThankYou'
import * as Assist from './HelperFunctions'

class App extends React.Component{
    constructor () {
        super();
        this.state = {
            step: 1
        }
        this.enquiryId = 0;
    }

    onOptionSelected = (opt) => {
        if (this.state.step === 1) {
            if (opt === 2) 
                return; //  CATTLE CASE

            this.setState({ 
                animalCategory: 'pet', 
                step: 2 
            })
        } 
        else {
            Assist.GetBreedList(opt).then((resp) => {
                this.setState({ 
                    animalType: opt === 1 ? 'dog' : 'cat', 
                    step: 3,
                    breedList: resp.data 
                })
            })
        }
    }

    onGetQuotes = () => {
        const payLoad = {
            Age: document.getElementById('age').value,
            Gender: document.getElementById('gender').value,
            Breed: document.getElementById('breed').value,
            TypeOfPet: 1,
            IsVaccinated: document.getElementById('vaccinated').value,
        }

        Assist.InsertPreQuoteDetails(payLoad).then(resp => {
            this.enquiryId = resp.data            
        })

        this.setState({ showNameDialog: true });
    }

    getStepDOM = () => {
        if ([1,2].includes(this.state.step)) {
            var btn1text = 'Pet', btn2text = 'Cattle', img1='pet', img2 = 'cattle'
            var style = null;

            if (this.state.step === 2) {
                btn1text = 'Dog'
                btn2text = 'Cat'
                img1 = 'dog'
                img2 = 'cat'
                style = {
                    marginRight: '-136px' 
                }
            }

            return (<>
                <p className='plainText'>I am here for my:</p>
                <img src={`images/${img1}.svg`} alt='' className='pet' />
                <button type="button" onClick={()=>this.onOptionSelected(1)} className="btn btn-outline-primary btn-lg pButton pButtonP">{btn1text}</button>
                <p className='orText'>Or</p>
                <img src={`images/${img2}.svg`} alt='' className='cattle' />
                <button type="button" onClick={()=>this.onOptionSelected(2)} className="btn btn-outline-primary btn-lg pButton pButtonC" style={style}>{btn2text}</button>
            </>
            );
        }

        return (
            <div className='centreDiv'>
                <form>
                    <div className="form-row pform">
                        <div className="form-group col-md-6">
                            <select className="form-control fieldMarginL" id='gender'>
                                <option value=''>Choose Gender</option>
                                <option value='M'>He</option>
                                <option value='F'>She</option>
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <select className="form-control fieldMarginR" id='age'> 
                                <option value=''>Choose Age</option>
                                <option value='1'>3 months to 2 yrs</option>
                                <option value='2'>2 yrs to 5 yrs</option>
                                <option value='3'>5 yrs to 7 yrs</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row pform">
                        <div className="form-group col-md-6">
                            <select className="form-control fieldMarginL" id='breed'>
                                <option value=''>Choose Breed</option>
                                {this.state.breedList.map(a => {
                                    return <option value={a}>{a}</option>
                                })
                                }
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <select className="form-control fieldMarginR" id='vaccinated'>
                                <option value=''>Vaccination Status</option>
                                <option value='1'>Yup, vaccinated</option>
                                <option value='0'>Nope, not vaccinated</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row pform">
                        <div className="form-group col-md-8 quoteBtn">
                            <button type="button" onClick={()=>this.onGetQuotes()} className="form-control btn btn-primary" >Get Quotes</button>
                        </div>
                    </div>
                </form>
            </div>   
        )
    }

    onNameEntered = () => {
        const payLoad = {
            Name: document.getElementById('petName').value,
            enquiry: this.enquiryId
        }

        Assist.InsertPetName(payLoad).then((resp) => {
            window.location = window.location.href + "quotes?e=" + this.enquiryId
        });
    }

    renderNameDialog = () => {
        if (!this.state.showNameDialog)
            return null;

        return <>
            <div className='grayBtn' />
              <div className='nameDialog'>
                  <img src='images/name.gif' alt='' className='nameDialogImg' />
                  <p className='nameLabel'>Oh btw, what's your furry friend's name?</p>
                  <div className="input-group mb-1 nameDialogTxt">
                    <input type="text" className="form-control" id='petName' />
                    <div className="input-group-append">
                        <span className="input-group-text" onClick={this.onNameEntered}>&#8594;</span>
                    </div>
                  </div>
            </div>
        </>
    }

    render () {
        if (window.location.href.includes('quotes'))
            return <Quotes />;

        if (window.location.href.includes('proposal'))
            return <Proposal />;

        if (window.location.href.includes('thanks'))
            return <ThankYou />;

        return <> 
            <div>
              <img src='images/pb-logo.svg' alt='default' className='pblogo' height='28'/>
              <img src='images/designTR.svg' alt='default' className='designTR' />
              <img src='images/designBL.svg' alt='default' className='designBL' />
              <img src='images/lineTL.svg' alt='default' className='lineTL' />
              <div className="centreDiv">
                  <h1 className='heading'>Find the right insurance for your four legged friend!</h1>
                  <img src={`images/${this.state.step}of3.svg`} alt='default' className='steps' />
                  <div className='infoBlock'>
                    {this.getStepDOM()}
                  </div>
              </div>
              {this.renderNameDialog()}
            </div>
        </>
    }
}

export default App