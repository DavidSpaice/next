import React from "react";

function page() {
  return (
    <div className="flex flex-col h-screen items-center">
      <div className="w-2/4">
        <p className="title">
          Thank you for registering your warranty with us.
        </p>
        <p>
          We have successfully received your warranty registration information.
          Your warranty is now active, and you can enjoy the benefits and
          coverage it provides for your Airtek/Gree product.
        </p>
        <p>
          In the event that you need to make a warranty claim in the future,
          please make sure to keep a copy of your warranty registration details
          for reference. If you have any questions or concerns regarding your
          warranty coverage, feel free to reach out to our dedicated support
          team at <a href="tel:1-866-969-1931">1 (866) 969-1931</a>. We are here
          to assist you.
        </p>
        <p>
          Once again, we appreciate your trust in our products. We strive to
          provide reliable and high-quality solutions, and your warranty
          registration helps us ensure a seamless ownership experience for you.
        </p>
        <p>
          Thank you for choosing Airtek/Gree, and we look forward to serving you
          in the future.
        </p>
      </div>
    </div>
  );
}

export default page;
