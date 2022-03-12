import React, { useCallback, useEffect, useRef, useState } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import CommaNumber from 'comma-number'
import { minus, plus } from 'react-icons-kit/feather'
import { SearchableSelect, SingleSelect } from '../../components/select'
import { CouponApply } from '../../components/form/order/CouponApply'
import { Customer } from '../../components/form/order/Customer'
import { toast, Slide } from 'react-toastify'
import Requests from '../../utils/Requests/Index'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'


toast.configure({
    autoClose: 1500,
    transition: Slide,
    position: "top-right",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
})

const Create = () => {
    const selectedField = useRef()
    const history = useHistory()
    const { register, handleSubmit, clearErrors, setError, errors } = useForm()
    const [placed, setPlaced] = useState(false)
    const [loading, setLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState("COD")
    const [type, setType] = useState("")
    const [selectedItems, setSelectedItems] = useState([])
    const [process, setProcess] = useState({ data: null, loading: false })
    const [coupon, setCoupon] = useState({ loading: false, message: {} })
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [selectedDivision, setSelectedDivision] = useState(null)
    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [selectedArea, setSelectedArea] = useState(null)
    const [divisions, setDivisions] = useState([])
    const [districts, setDistricts] = useState([])
    const [areas, setAreas] = useState([])
    const [isCouponApplied, setIsCouponApplied] = useState(false)
    const [subTotal, setSubTotal] = useState(null)
    const [deliveryCharge, setDeliveryCharge] = useState(null)
    const [total, setTotal] = useState(null)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })

    console.log(type)
    // Count total amount
    const TotalAmount = (subTotal, dCharge) => {
        return subTotal + dCharge;
    }

    // Handle product search from API
    const handleProductSearch = async (inputValue) => {
        let results = []
        const response = await Requests.Product.Search(inputValue, header)

        if (response && response.data && response.data.length) {
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i]
                results.push({
                    ...element,
                    label: element.sku + ' - ' + element.name.slice(0, 40) + ' ...',
                    name: element.name.slice(0, 10) + ' ...',
                    quantity: 1,
                    value: element._id,
                    image: element.thumbnail
                })
            }
        }
        return results
    }
      // Handle coupon
      const handleCoupon = async (data) => {
        let products = []

        if (selectedItems && selectedItems.length) {
            for (let i = 0; i < selectedItems.length; i++) {
                const element = selectedItems[i]
                products.push({
                    ...element,
                    quantity: element.quantity,
                    _id: element.value
                })
            }
        }
        const formData = {
            ...data,
            products: products,
            // shippingLocation: area.value,
            processId: process.data.processId
        }

        setCoupon({ ...coupon, loading: true })
        const response = await Requests.Order.ApplyCoupon(formData, header)

        if (response && response.sucess) {
            toast.success(response.message)
            setIsCouponApplied(true)
            setProcess({
                ...process, data: {
                    ...process.data,
                    coupon: response.data && response.data.available_coupon ? response.data.available_coupon : null,
                    subTotal: response.data && response.data.subTotal ? response.data.subTotal : null,
                    shippingCharge: response.data && response.data.shippingCharge ? response.data.shippingCharge : null,
                    totalPrice: response.data && response.data.totalPrice ? response.data.totalPrice : null
                }
            })
            setCoupon({ ...coupon, loading: false, message: { type: "success", value: response.message } })

        } else {
            setCoupon({ ...coupon, loading: false })
        }

    }


    // Handle Selected products values
    const handleSelectedProductsValues = data => setSelectedItems(data)

    // Increment Quantity
    const incrementQuantity = key => {
        let items = [...selectedItems]
        let item = { ...items[key] }
        item.quantity += 1
        items[key] = item
        setSelectedItems(items)
        setProcess({ ...process, data: null })
        setCoupon({ loading: false, message: {} })
    }

    // Decrement Quantity
    const decrementQuantity = key => {
        let items = [...selectedItems]
        let item = { ...items[key] }
        item.quantity -= 1
        items[key] = item
        setSelectedItems(items)
        setProcess({ ...process, data: null })
        setCoupon({ loading: false, message: {} })
    }

    /* fetch division */
    const fetchDivision = useCallback(async () => {
        const response = await Requests.Services.Shipping.MainShipping.DivisionList(header)
        let items = []
        if (response && response.data) {
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i]
                items.push({
                    label: element.name,
                    value: element._id,
                })
            }
        }
        setDivisions(items)
    }, [])

    /* fetch district */
    const fetchDistrict = async (id) => {
        const response = await Requests.Services.Shipping.MainShipping.DistrictList(id, header)
        let items = []
        if (response && response.data) {
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i]
                items.push({
                    label: element.name,
                    value: element._id,
                })
            }
        }
        setDistricts(items)
    }

    /* fetch area */
    const fetchArea = async (id) => {
        const response = await Requests.Services.Shipping.MainShipping.AreaList(id, header)
        let items = []
        if (response && response.data) {
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i]
                items.push({
                    label: `${element.post_office} - ${element.post_code}`,
                    value: element._id,
                })
            }
        }
        setAreas(items)
    }

    // Division
    useEffect(() => {
        fetchDivision()
    }, [fetchDivision])

    // Process Order
    const processOrder = async (data) => {

        let is_error = false

        if (!selectedDivision) {
            setError("division", {
                type: "manual",
                message: "Division is required."
            })
            is_error = true 
        }
        if (!selectedDistrict) {
            setError("district", {
                type: "manual",
                message: "District is required."
            })
            is_error = true 
        }
        if (!selectedArea) {
            setError("area", {
                type: "manual",
                message: "Area is required."
            })
            is_error = true
        }

        if (is_error) return

        let products = []

        if (selectedItems && selectedItems.length) {
            for (let i = 0; i < selectedItems.length; i++) {
                const element = selectedItems[i]
                products.push({
                    quantity: element.quantity,
                    _id: element.value
                })
            }
        }

        const formData = {
            products: [...products],
            division: selectedDivision.value,
            district: selectedDistrict.value,
            area: selectedArea.value
        }

        setProcess({ ...process, loading: true })
        const response = await Requests.Order.ProcessOrder(formData, header)
        setProcess({ data: response, loading: false })
        setSubTotal(response && response.subTotal ? response.subTotal : 0)
        setDeliveryCharge(response && response.shippingCharge ? response.shippingCharge : 0)
        setTotal(response && response.totalPrice ? response.totalPrice : 0)

    }

    // Handle coupon
   
    // Handle customer search from API
    const handleCustomerSearch = async (inputValue) => {
        let results = []
        const response = await Requests.Order.SearchCustomer(inputValue, header)

        if (response && response.data && response.data.length) {
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i]
                results.push({
                    value: element._id,
                    label: element.name + "-" + element.phone,
                    name: element.name,
                    email: element.email,
                    phone: element.phone,
                    shippingArea: element.shippingAddress,
                    deliveryAddress: element.deliveryAddress,
                    postCode: element.postCode,
                    postOffice: element.postOffice,
                    upazila: element.upazila
                })
            }
        }

        return results
    }


    // Place order
    const placeOrder = async data => {
        const formData = {
            ...data,
            // shippingArea: area && area.value ? area.value : null,
            // postCode: postCode && postCode.value ? postCode.value : null,
            // postOffice: postOffice || null,
            coupon: process.data && process.data.coupon && process.data.coupon._id ? process.data.coupon._id : null,
            subTotal: subTotal || 0,
            shippingCharge: deliveryCharge || 0,
            totalPrice: total || 0,
            // upazila: upzila || null,
            isCouponApplied: isCouponApplied,
            couponInfo: process.data && process.data.coupon ? process.data.coupon : null,
            products: JSON.stringify(process.data && process.data.products ? process.data.products : null)
        }

        setPlaced(true)
        const response = await Requests.Order.PlaceOrder(formData, header)
        if (response) {
            setSelectedItems([])
            history.push("/dashboard/order");
        }
        setPlaced(false)
    }


    return (
        <div className="order-create-container">
            <div className="container-fluid">
                <div className='col-padding'>
                    <div className="form-group mb-4">
                        <p>Type</p>

                        <select
                            name="paymentMethod"
                            className="form-control shadow-none"
                            defaultValue="" 
                            onChange={(e) => setType(e.target.value)}                        
                        >
                                <option value="">--- Select Option ---</option>
                                <option value="e-commerece">E-Commerce</option>
                                <option value="print on demand">Print on Demand</option>
                                <option value="call for tailor">Call for tailor</option>
                                <option value="studio">Studio</option>
                        </select>
                    </div>
                </div>
               {
                   type==="e-commerece" || type=== "print on demand"?  <div className="row">
                
                   {/* Header & search container */}
                   <div className="col-12 col-padding">
                       <SearchableSelect
                           isMulti={true}
                           placeholder="Search product by SKU"
                           search={handleProductSearch}
                           values={handleSelectedProductsValues}
                       />
                   </div>

                   {/* Selected items container */}
                   <div className="col-12 col-padding selected-products-container">
               
                           <div className="card border-0 p-2" >
                               <div className="card-body shadow-sm bg-white rounded text-center">
                                   <div className="img-container">
                                       <img src="https://i.ibb.co/nfN0hdR/undraw-road-to-knowledge-m8s0.png" className="img-fluid" alt="..." />
                                   </div>
                                   <p>Test</p>

                                   <div className="d-flex mt-2">
                                       <div><p>Quantity: 5</p></div>
                                       <div className="ml-auto pt-2">
                                           <button className="btn btn-sm shadow-none rounded-circle btn-desc"
                                               
                                               // onClick={() => decrementQuantity(5)}
                                           >
                                               <Icon icon={minus} size={15} />
                                           </button>
                                           <button className="btn btn-sm shadow-none rounded-circle btn-inc ml-1"
                                               // onClick={() => incrementQuantity(5)}
                                           >
                                               <Icon icon={plus} size={15} />
                                           </button>
                                       </div>
                                   </div>
                               </div>
                           </div>
                   </div>

                   {/* Process Order Button */}
                    <div className='col-12'>
                          <form onSubmit={handleSubmit(processOrder)}>
                              <div className='row'>
                                  {/* Adress */}
                                  <div className="col-12 col-lg-6">
                                      <div className="form-group mb-4">
                                          {errors.division && errors.division.message ?
                                              <small className="text-danger">{errors.division && errors.division.message}</small> :
                                              <small>Address<span className="text-danger">*</span></small>
                                          }

                                          <SingleSelect
                                              options={divisions}
                                              placeholder={'adress'}
                                              borderRadius={4}
                                              error={errors.division && errors.division.message}
                                              value={(event) => {
                                                  setSelectedDivision(event)
                                                  fetchDistrict(event.value)
                                                  clearErrors("address")
                                              }}
                                          />
                                      </div>
                                  </div>
                                  

                                  {/* Phone No */}
                                  {
                                      <div className="col-12 col-lg-6">
                                          <div className="form-group mb-4">
                                              {errors.district && errors.district.message ?
                                                  <small className="text-danger">{errors.district && errors.district.message}</small> :
                                                  <small>Phone No<span className="text-danger">*</span></small>
                                              }

                                          <input
                                              type="text"
                                              name="deliveryAddress"
                                              className="form-control shadow-none"
                                              placeholder="Enter phone number"
                                              
                                              ref={register({ required: "Phone number is required" })}
                                          />
                                          </div>
                                      </div>
                                     }

                                     {/* Name */}
                                          {
                                      <div className="col-12 col-lg-6">
                                          <div className="form-group mb-4">
                                              {errors.district && errors.district.message ?
                                                  <small className="text-danger">{errors.district && errors.district.message}</small> :
                                                  <small>Name<span className="text-danger">*</span></small>
                                              }

                                          <input
                                              type="text"
                                              name="deliveryAddress"
                                              className="form-control shadow-none"
                                              placeholder="Enter phone number"
                                              
                                              ref={register({ required: "Name is required" })}
                                          />
                                          </div>
                                      </div>
                                     }



                                  {/* Email*/}
                                  {
                                      <div className="col-12 col-lg-6">
                                          <div className="form-group mb-4">
                                              {errors.area && errors.area.message ?
                                                  <small className="text-danger">{errors.area && errors.area.message}</small> :
                                                  <small>Email</small>
                                              }
                                              <input
                                              type="email"
                                              name="deliveryAddress"
                                              className="form-control shadow-none"
                                              placeholder="example@gmail.com"
                                              
                                              ref={register('email')}
                                          />
                                          </div>
                                      </div>
                                      }

                                      {/* Zone */}
                                      {
                                      <div className="col-12 col-lg-6">
                                      <div className="form-group mb-4">
                                          {errors.division && errors.division.message ?
                                              <small className="text-danger">{errors.division && errors.division.message}</small> :
                                              <small>Zone<span className="text-danger">*</span></small>
                                          }

                                          <SingleSelect
                                              options={divisions}
                                              placeholder={'zone'}
                                              borderRadius={4}
                                              error={errors.division && errors.division.message}
                                              value={(event) => {
                                                  
                                                  clearErrors("zone")
                                              }}
                                          />
                                      </div>
                      </div>
                                      }

                                        {/* Processing price */}
                  
                      <div className="col-12 py-3">
                          <div className="card border-0 shadow-sm">
                              <div className="card-body p-4">
                                  <div>
                                      {/* Payment method */}
                                      <div>
                                          <div className="form-group mb-4">
                                              <p>Payment method</p>

                                              <select
                                                  name="paymentMethod"
                                                  className="form-control shadow-none"
                                                  defaultValue="COD"
                                                  onChange={(e) => setPaymentMethod(e.target.value)}
                                              >
                                                  <option value="">--- Select Option ---</option>
                                                  <option value="COD">COD</option>
                                                  <option value="Paid">Paid</option>
                                                  <option value="Partial Paid">Partial Paid</option>
                                              </select>
                                          </div>
                                      </div>
                                     
                                  </div>
                                  <div className="d-flex">
                                      <div>
                                          <p className="text-muted mb-1">Sub-Total</p>
                                          <p className="text-muted mb-1">Delivery charge </p>

                                      </div>
                                      <div className="ml-auto">
                                          <p className="text-muted mb-1">: ৳. 450 {CommaNumber(subTotal)}</p>
                                          <p className="text-muted mb-1">: ৳. 50{CommaNumber(deliveryCharge)}</p>
                                      </div>
                                  </div>
                                  <hr className="my-2" />
                                  <div className="d-flex">
                                      <div>
                                          <p className="mb-1">Total</p>
                                      </div>
                                      <div className="ml-auto">

                                          <p className="mb-1">: ৳. 500 {CommaNumber(total)}</p>
                                      </div>
                                  </div>
                                  <br />
                                  <CouponApply
                                      loading={coupon.loading}
                                      message={coupon.message}
                                      value={handleCoupon}
                                  />

                              </div>
                          </div>
                      </div>


                                  <div className="col-12 text-center py-3">
                                      <button  className="btn shadow-none success-btn px-4 py-2"
                                          disabled={process.loading}
                                      >{process.loading ? "Creating ..." : "Create Order"}</button>
                                  </div>
                              </div>
                          </form>
                      </div>    
                   

                 
               
                 
                     
           
               </div>:  type? <div className="col-12 text-center py-3">
                                      <button  className="btn shadow-none success-btn px-4 py-2"
                                        
                                      >Go to..</button>
                                  </div>:<p></p>
               }
            </div>
        </div>
    );
}

export default Create;
