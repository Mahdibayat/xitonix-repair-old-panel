import React, { Component } from "react";
import ReactToPrint from "react-to-print";
import { getItemStatus, PriceFormat } from "../scripts/helpers";
import resources from "../scripts/resources";

class FactorPrint extends Component {
  state = {
    factor: [],
    newRow: [],
    orderItem: [],
  };
  handlePrice = (a, b) => {
    const sum = parseInt(a) + parseInt(b);
    return PriceFormat(sum);
  };
  render() {
    const { detail } = this.props;
    console.log(detail)
    return (
      
      <div className="container container-print pb-3">
        <div className="col-12">
          <div className="row">
            <div className="col-12 pt-1 text-center">
              <h4>{resources.checkout_page}</h4>
            </div>
            <div className="col-12 text-center">
              <table className="table table-bordered w-100 mt-2">
              <thead>
                  <tr className="text-center">
                    <th className="text-center">نام</th>
                    <th className="text-center">تلفن</th>
                    <th className="text-center"> شهر</th>
                  </tr>
                </thead>
                <tbody>
               
                  <th className="text-center">{`${detail?.user?.full_name}`}</th>
                  <th className="text-center">{detail?.user?.phone}</th>
                  <th className="text-center">{detail?.user?.city?.name}</th>
                </tbody>
              </table>
            </div>
            {(detail.devices) && (detail.devices.length) && 
              <>
              <div className='set_middle_content m-3'><span>دستگاه ها
                ({detail.devices.length})
                </span></div> 
              <div className="col-12">
                <table className="table table-bordered w-100 mt-2">
                  <thead>
                    <tr className="text-center">
                    <th className="text-center">imei </th>
                    <th className="text-center">نام</th>
                      <th className="text-center">سریال</th>
                      <th className="text-center">کد</th>
                      <th className="text-center">زمان تقریبی (ساعت)  </th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.devices.map((item) => (
                      <tr>
                        <th className="text-center">{item.IMEI}</th>
                        <th className="text-center">{item.name}</th>
                        <th className="text-center">{item.serial}</th>
                        <th className="text-center"> {item.otp}</th>
                        <th className="text-center"> {item.repair_time} </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </>
            }

              {(detail.items) && (detail.items.length) &&
                <>
                <div className='set_middle_content m-3'><span> اقلام
                  ({detail.items.length})
                  </span></div> 
                <div className="col-12">
                  <table className="table table-bordered w-100 mt-2">
                    <thead>
                      <tr className="text-center">
                        <th className="text-center">نام </th>
                        <th className="text-center">زمان تقریبی (ساعت)  </th>
                        <th className="text-center">وضعیت </th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.items.map((item) => (
                        <tr>
                          <th className="text-center">{item.name}</th>
                          <th className="text-center"> {item.repair_time} </th>
                          <th className="text-center"> {getItemStatus(item.status)} </th>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </>
              }   


          {(detail.replacement_parts) && (detail.replacement_parts.length) &&
          <>
           <div className='set_middle_content m-3'><span> قطعات تعویضی
            ({detail.replacement_parts.length})
            </span></div> 
           <div className="col-12">
             <table className="table table-bordered w-100 mt-2">
               <thead>
                 <tr className="text-center">
                   <th className="text-center">نام </th>
                   <th className="text-center">قیمت (تومان) </th>
                   <th className="text-center">گارانتی </th>
                 </tr>
               </thead>
               <tbody>
                 {detail.replacement_parts.map((item) => (
                   <tr>
                     <th className="text-center">{item.name}</th>
                     <th className="text-center"> {PriceFormat(item.price)} </th>
                     <th className="text-center"> {item.guarantee ? "دارد" : "ندارد"} </th>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
           </>
          }
           

            {(detail.healthy_parts) && (detail.healthy_parts.length) && 
            <>
            <div className='set_middle_content m-3'><span> قطعات سالم
              ({detail.healthy_parts.length})
              </span></div> 
            <div className="col-12">
              <table className="table table-bordered w-100 mt-2">
                <thead>
                  <tr className="text-center">
                    <th className="text-center">نام </th>
                    <th className="text-center">قیمت (تومان) </th>
                  </tr>
                </thead>
                <tbody>
                  {detail.healthy_parts.map((item) => (
                    <tr>
                      <th className="text-center">{item.name}</th>
                      <th className="text-center"> {PriceFormat(item.price)} </th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
            }

      <hr />
            <div className="col-12">
              <table className="table table-bordered w-100 mt-2">
                <thead>
                  <tr className="text-center">
                    <th className="text-center">قیمت کل (تومان) </th>
                  </tr>
                </thead>
                <tbody>
                    <tr>
                      <th className="text-center"> {PriceFormat(detail.totalPrice)} </th>
                    </tr>
                </tbody>
              </table>
            </div>

            <hr />
            <div className="col-12">
              <table className="table table-bordered w-100 mt-2">
                <thead>
                  <tr className="text-center">
                    <th className="text-center">امضا اول </th>
                    <th className="text-center">امضا دوم </th>
                    <th className="text-center">امضا سوم </th>
                  </tr>
                </thead>
                <tbody>
                    <tr style={{height: "55px"}}>
                      <th className="text-center"> </th>
                      <th className="text-center"> </th>
                      <th className="text-center"> </th>
                    </tr>
                </tbody>
              </table>
            </div>
        </div>
      </div>
      </div>
    );
  }
}
class CheckoutPagePrintComponent extends React.Component {
  render() {
    return (
      <div className="container text-center">
        <div className="row">
          <div className="col-md-12">
            <FactorPrint
              detail={this.props.printDetail}
              ref={(el) => (this.componentRef = el)}
            />
          </div>
          <div className="col-md-12">
            <ReactToPrint
              // copyStyles
              trigger={() => (
                <button
                  data-dismiss="modal"
                  className="btn btn-none-box btn-info border-radius-lg border-md color-light mt-5"
                >
                  پرینت 
                </button>
              )}
              bodyClass="rtl"
              content={() => this.componentRef}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default CheckoutPagePrintComponent;
