import React, { useEffect, useState } from "react";

const BuyCourseButton = ({ courseId }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Fetch course details (to get amount)
  useEffect(() => {
    fetch(`/api/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => setCourse(data))
      .catch((err) => console.error("Failed to load course:", err));
  }, [courseId]);

  const handleBuy = async () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return alert("Please log in to purchase.");
    if (!course) return alert("Course data still loading…");
    if (course.status !== "Paid") return alert("This course is free!");

    setLoading(true);

    // 2. Create Razorpay order for course.amount
    const orderRes = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: user.token,
      },
      body: JSON.stringify({ amount: course.amount }),
    });
    const order = await orderRes.json();

    // 3. Configure Razorpay checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "MyLearning Platform",
      description: `Purchase: ${course.title}`,
      order_id: order.id,
      prefill: {
        name: user.name,
        email: user.email,
      },
      theme: { color: "#7c3aed" },
      
      handler: async (response) => {
        // 4. Verify payment & enroll
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: user.token,
          },
          body: JSON.stringify({
            razorpay_order_id:    response.razorpay_order_id,
            razorpay_payment_id:  response.razorpay_payment_id,
            razorpay_signature:   response.razorpay_signature,
            student:              user._id,
            course:               courseId,
          }),
        });
        const verifyData = await verifyRes.json();
console.log("Razorpay key used:", import.meta.env.VITE_RAZORPAY_KEY_ID);

        if (verifyData.success) {
          alert("🎉 Payment successful! You’re now enrolled.");
          window.location.reload();
        } else {
          alert("❌ Payment verification failed—please contact support.");
        }
      },
    };

    setLoading(false);
    new window.Razorpay(options).open();
  };

  return (
    <button
      className="btn btn-primary w-100"
      onClick={handleBuy}
      disabled={!course || loading}
    >
      { !course
          ? "Loading…"
          : loading
            ? "Processing…"
            : course.status === "Paid"
              ? `Buy Now ₹${course.amount}`
              : "Enroll for Free"
      }
    </button>
  );
};

export default BuyCourseButton;
