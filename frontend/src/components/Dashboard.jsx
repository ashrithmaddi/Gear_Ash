import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import './Dashboard.css';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Dashboard() {

  const [students,setStudents]=useState(0)
  const [lecturers,setLecturers]=useState(0)
  const [courses,setCourses]=useState(0)
  // const [revenue,setRevenue]=useState(0)

  const [feeCollectionData, setFeeCollectionData] = useState([]);  
  // Stats counters with animation
  const [stats, setStats] = useState({
    students: 0,
    lecturers: 0,
    courses: 0,
    // revenue: 0
  });
  
  // Target values for counting animation
  const targetStats = { 
    students:students,
    lecturers: lecturers,
    courses: courses,
    // revenue: revenue
  };
  
  useEffect(() => {
  
    // Set fee collection data
    setFeeCollectionData([
      { y: 45000, name: "Collected", color: "#4CAF50" },
      { y: 15000, name: "Pending", color: "#F44336" }
    ]);
    
    // Animate counter stats
    const duration = 2000; // 2 seconds animation
    const steps = 50;
    const interval = duration / steps;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      
      if (currentStep <= steps) {
        const progress = currentStep / steps;
        
        setStats({
          students: Math.round(targetStats.students * progress),
          teachers: Math.round(targetStats.teachers * progress),
          courses: Math.round(targetStats.courses * progress),
          revenue: Math.round(targetStats.revenue * progress)
        });
      } else {
        clearInterval(timer);
      }
    }, interval);
    
    const fetchTotalStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/getTotalStudents");
        setStudents(res.data.students);
      } catch (err) {
        console.log(err)
      }
    };

    const fetchTotalLecturers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/getTotalLecturers");
        setLecturers(res.data.lecturers);
      } catch (err) {
        console.log(err)
      }
    };


    const fetchTotalCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/getTotalCourses");
        setCourses(res.data.courses);
      } catch (err) {
        console.log(err)
      }
    };

    // const fetchTotalRevenue = async () => {
    //   try {
    //     const res = await axios.get("http://localhost:5000/api/admin/getTotalRevenue");
    //     setStudents(res.data.students);
    //   } catch (err) {
    //     console.log(err)
    //   }
    // };
   
    fetchTotalStudents();
    fetchTotalLecturers();
    fetchTotalCourses();
    //fetchTotalRevenue();

    return () => clearInterval(timer);
  }, []);
  
 
  // Chart options for fee collection
  const feeOptions = {
    animationEnabled: true,
    title: {
      text: ""
    },
    subtitles: [{
      text: "Fee Collection Status",
      verticalAlign: "center",
      fontSize: 14,
      dockInsidePlotArea: true
    }],
    data: [{
      type: "doughnut",
      showInLegend: true,
      indexLabel: "{name}: ₹{y}",
      yValueFormatString: "#,###",
      dataPoints: feeCollectionData
    }]
  };


  return (
    <div id="dashboard" className="dashboard m-0">
      <h2 className="mt-2">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {/* Total Students */}
        <div className="col-md-6 col-lg-3">
          <div className="card stat-card">
            <div className="card-body d-flex align-items-center">
              <i className="fas fa-user-graduate fa-3x me-3 text-primary"></i>
              <div>
                <h6>Total Students</h6>
                <h3>{students}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="col-md-6 col-lg-3">
          <div className="card stat-card">
            <div className="card-body d-flex align-items-center">
              <i className="fas fa-chalkboard-teacher fa-3x me-3 text-primary"></i>
              <div>
                <h6>Total Lecturers</h6>
                <h3>{lecturers}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Active Courses */}
        <div className="col-md-6 col-lg-3">
          <div className="card stat-card">
            <div className="card-body d-flex align-items-center">
              <i className="fas fa-book-open fa-3x me-3 text-primary"></i>
              <div>
                <h6>Active Courses</h6>
                <h3>{courses}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        {/* <div className="col-md-6 col-lg-3">
          <div className="card stat-card">
            <div className="card-body d-flex align-items-center">
              <i className="fas fa-dollar-sign fa-3x me-3 text-primary"></i>
              <div>
                <h6>Revenue</h6>
                <h3>${Math.floor(revenue/1000)}K</h3>
              </div>
            </div>
          </div>
        </div> */}
      </div>


      <div className="row g-4 mb-4">
    

        {/* Fee Collection */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="m-0">Fee Collection</h5>
            </div>
            <div className="card-body">
              <CanvasJSChart options={feeOptions} />
              <div className="mt-4">
                <div className="d-flex justify-content-between mb-2">
                  <span><span className="status-dot collected"></span> Collected</span>
                  <span className="text-success">₹45,000</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span><span className="status-dot pending"></span> Pending</span>
                  <span className="text-danger">₹15,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;