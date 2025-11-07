import React from 'react'

const TopbarSection = ({style}) => {
  return (
    <section className={style}>
        <div className="container">
            <div className="row">
                <div className="col-xl-6 col-md-6 d-none d-md-block">
                    <div className="tf__topbar_left d-flex flex-wrap align-items-center">
                        <p>Visit our social pages:</p>
                        <ul className="d-flex flex-wrap">
                            <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                            <li><a href="https://whatsapp.com/channel/0029Vb6CxN33WHTQbv12KJ2q" target='_blank'><i className="fab fa-whatsapp"></i></a></li>
                        </ul>
                    </div>
                </div>
               
            </div>
        </div>
    </section>
  )
}

export default TopbarSection