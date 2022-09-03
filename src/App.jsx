import { useState, useEffect } from 'react'
import Header from './components/Header'
import Modal from 'react-modal';
import find from './assets/images/find.png'
import pin from './assets/images/pin.png'
import banner2 from './assets/images/banner2.png'
import './App.css'
import './components/Card.css'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '700px'
  },
};

Modal.setAppElement('#root');

function App() {
  const [provinces, setProvinces] = useState([])
  const [dealers, setDealers] = useState([])
  const [posLang, setPosLang] = useState("")
  const [posLong, setPosLong] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState("")
  const [modalIsOpen, setIsOpen] = useState(false);
  const [detail, setDetail] = useState({});

  function distance(lat1, lon1, lat2, lon2, unit) {
    // console.log("param dist ", lat1, lon1, lat2, lon2)

    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    // console.log("dealer terdekat ", title, " jaraknya ", dist)

    return dist
  }

  const fetchDealers = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords
        setPosLang(latitude)
        setPosLong(longitude)
        const response = await fetch(`https://mitsubishi.trinix.id/api/frontend/search-dealers?keyword=${keyword}&page=${page}&limit=9`)
        const data = await response.json()

        // console.log("getdistance", getdistance)
        // const monaslang = -6.175392;
        // const monaslong = 106.827153;

        let dealersval = []

        for (var i = 0; i < data.data.length; i++) {
          if (distance(latitude, longitude, data.data[i].latitude, data.data[i].longitude, "K", data.data[i].title) <= 10) {
            // console.log("dealer terdekat ", data.data[i].title + " jaraknya " + distance(-6.175392, 106.827153, data.data[i].latitude, data.data[i].longitude, "K", data.data[i].title))
            dealersval.push(data.data[i])
          } else {
            dealersval = data.data
          }
        }

        // setDealers(dealersval)
        setDealers([...dealers, ...dealersval])
        setIsLoading(false)

      }, async (showError) => {
        console.log(showError)
        switch (showError.code) {
          case showError.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.")
            break;
          case showError.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.")
            break;
          case showError.TIMEOUT:
            alert("The request to get user location timed out.")
            break;
          case showError.UNKNOWN_ERROR:
            alert("An unknown error occurred.")
            break;
        }
        fetchDealer()
        // window.location.reload()
      })
    } else {
      alert('Geolocation not supported by this browser')
    }
  }

  const fetchProvince = async () => {
    await fetch('https://mitsubishi.trinix.id/api/frontend/get-provinces')
      .then((response) => response.json())
      .then((data) => setProvinces(data))
      .catch(error => {
        console.log(error)
      })
  }

  const handleChangeProvince = async (e) => {
    console.log(e.target.value)
    const provinceName = e.target.value
    await fetch(`https://mitsubishi.trinix.id/api/frontend/search-dealers?keyword=${provinceName}&page=1&limit=9`)

      .then((response) => response.json())
      .then((data) => {
        console.log("dealers", data.data)
        setDealers(data.data)
        setPage(1)
        setKeyword(provinceName)
        setIsLoading(false)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const setLoadMore = async () => {
    setPage((page) => page + 1);
    console.log("page", page)
  }

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  const detailDealer = (id, title, address, showroom, bengkel, services, distance_km, long, lat, phone) => {
    console.log("id", id)
    const data =
    {
      id: id,
      title: title,
      address: address,
      showroom: showroom,
      bengkel: bengkel,
      services: services,
      distance_km: distance_km,
      long: long,
      lat: lat,
      phone: phone
    }

    console.log("data", data)

    setDetail(data)
    setIsOpen(true)

  }

  useEffect(() => {
    fetchDealers()
    fetchProvince()

  }, [page])

  return (
    <div className="App">
      <Header />
      <section className='find-dealer'>
        <div className='find-dealer-left'>
          <h1>Find dealer</h1>
          <p>Discover the nearest dealership in your area</p>
          <select onChange={(e) => handleChangeProvince(e)}>
            <option value=""><img src={find} alt="find" /> Pilih lokasi terdekat</option>
            {
              provinces.map((province, index) => {
                return (
                  <option value={province.name} key={index}>{province.name}</option>
                )
              })
            }
          </select>
        </div>
        <div className='find-dealer-right'>
          <p>
            Cari dan kunjungi dealer resmi Mitsubishi terdekat di kota Anda untuk mendapatkan pelayanan terbaik terkait dengan kendaraan dari Mitsubishi Motors Indonesia.
          </p>
        </div>
      </section>
      <section className='list'>
        {
          isLoading ? <h1>Loading...</h1> :
            (
              dealers.length > 0 ?
                <div className='cards'>
                  {
                    dealers.map((dealer, index) => {
                      return (
                        <div className='card' key={index}>
                          <div className='card-left'>
                            <img src={pin} alt="pin" />
                          </div>
                          <div className='card-right'>
                            <h3 onClick={() => detailDealer(dealer.id, dealer.title, dealer.address, dealer.bengkel_operational_hours, dealer.showroom_operational_hours, dealer.services, dealer.distance_km, dealer.longitude, dealer.latitude, dealer.phone)}>{dealer.title}</h3>
                            <p>{dealer.address}</p>
                            <span>
                              {
                                dealer.services.map((service) => (
                                  service + ' • '
                                ))
                              }
                            </span>
                          </div>
                        </div>
                      )
                    })

                  }
                </div>
                : <h1>Data kosong </h1>
            )
        }
        <button className='btnLoadMore' onClick={() => setLoadMore()}>Load More</button>
        <section className='banner-bottom'>
          <img src={banner2} alt="" className='banner-img' />
          <div className='banner-text'>
            <h1>
              Live simple with MY Mitsubishi
            </h1>
            <p>
              Nikmati semua fasilitas berkendara Mitsubishi,
              dari book test drive hingga service berkala
              langsung dari tangan Anda dengan My Mitsubishi ID.
              <br />
              Download aplikasinya sekarang di App Store dan Play Store.
            </p>
          </div>
        </section>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
          style={customStyles}
        >
          {
            <div className='card-modal'>
              {console.log("detail", detail)}
              <div className='card-left'>
                <img src={pin} alt="pin" />
              </div>
              <div className='card-right'>
                <div>
                  {
                    detail.services
                  }
                </div>
                <h3>{detail.title}</h3>
                <div className='address'>
                  <span>{detail.address}</span><span>{detail.distance_km} Km</span>
                </div>
                <span>
                  <a className='btnview' href='#' onClick={() => window.open(`https://www.google.com/maps/dir/Current+Location/${detail.lat},${detail.long}`, '_blank')}>view direction</a>
                </span>
                <div className='buttons'>
                  <a href="#" className='btnTestDrive'>Request Test Drive</a>
                  <a href="#" className='btnBookService'>Book Service</a>
                </div>
                <hr />
                <div className='place'>
                  <div className="showroom">
                    <h4>Showroom</h4>
                    <div>
                      {/* <label>
                      {
                        detail.showroom[0].days
                      }
                    </label>
                    <label>
                      {
                        detail.showroom[0].hours
                      }
                    </label> */}
                    </div>
                  </div>
                  <div className="bengkel">
                    <h4>Bengkel</h4>
                    <div>
                      {/* <label>
                      {
                        detail.bengkel[0].days
                      }
                    </label>
                    <label>
                      {
                        detail.bengkel[0].hours
                      }
                    </label> */}
                    </div>
                  </div>
                </div>
                <div className='place'>
                  <div className="showroom">
                    <h4>Contact</h4>
                    <div>
                      <label>
                        {
                          detail.phone
                        }
                      </label>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </Modal>
      </section>
    </div>
  )

}
export default App
