import React from "react";

function page() {
  return (
    <div className="flex flex-col h-screen items-center">
      <div className="w-2/6">
        <p className="title">Thank You for Your Warranty Claim Application!</p>
        <p>
          We are delighted to inform you that we have received your warranty
          claim application. Your satisfaction is our top priority, and we are
          committed to resolving any issues with your product promptly and
          efficiently.
        </p>
        <p>
          Our team is currently reviewing the details provided in your claim
          form, including the model, serial number, installation date, invoice,
          and other relevant information. We understand the importance of your
          claim and assure you that we will handle it with the utmost care.
        </p>
        <p>
          Our dedicated warranty team will carefully assess your claim to ensure
          it meets the warranty terms and conditions. If any further information
          is required, we will get in touch with you promptly.
        </p>
        <p>
          Rest assured that we will keep you informed throughout the entire
          process. Our aim is to process your claim swiftly and provide a
          resolution that meets your expectations.
        </p>
        <p>
          In the meantime, if you have any additional questions or require
          further assistance, please feel free to reach out to our customer
          support team at <a href="tel:1-866-969-1931"> 1 (866) 969-1931 </a> or
          <a href="mailto:support@airtekontario.com">
            {" "}
            support@airtekontario.com
          </a>
          .
        </p>
        <p>
          Thank you for choosing Airtek Ontario Inc. We value your trust in our
          products and services, and we remain committed to providing you with
          the best customer experience.
        </p>
      </div>
    </div>
  );
}

export default page;
