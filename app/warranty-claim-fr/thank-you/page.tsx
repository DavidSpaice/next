import React from "react";

function page() {
  return (
    <div className="flex flex-col h-screen items-center">
      <div className="w-2/6">
        <p className="title">Merci pour votre demande de garantie !</p>
        <p>
          Nous sommes ravis de vous informer que nous avons reçu votre demande
          de garantie. Votre satisfaction est notre priorité absolue, et nous
          nous engageons à résoudre tout problème avec votre produit rapidement
          et efficacement.
        </p>
        <p>
          Notre équipe examine actuellement les détails fournis dans votre
          formulaire de réclamation, y compris le modèle, le numéro de série, la
          date d&lsquo;installation, la facture et d&lsquo;autres informations
          pertinentes. Nous comprenons l&lsquo;importance de votre réclamation
          et vous assurons que nous la traiterons avec le plus grand soin.
        </p>
        <p>
          Notre équipe de garantie dédiée évaluera soigneusement votre
          réclamation pour s&lsquo;assurer qu&lsquo;elle respecte les termes et
          conditions de la garantie. Si des informations supplémentaires sont
          nécessaires, nous vous contacterons rapidement.
        </p>
        <p>
          Soyez assuré que nous vous tiendrons informé tout au long du
          processus. Notre objectif est de traiter votre réclamation rapidement
          et de fournir une résolution qui répond à vos attentes.
        </p>
        <p>
          Entre-temps, si vous avez des questions supplémentaires ou si vous
          avez besoin d&lsquo;une assistance complémentaire, n&lsquo;hésitez pas
          à contacter notre équipe de support client au{" "}
          <a href="tel:1-866-969-1931">1 (866) 969-1931</a> ou par email à
          <a href="mailto:support@airtekontario.com">
            {" "}
            support@airtekontario.com
          </a>
          .
        </p>
        <p>
          Merci d&lsquo;avoir choisi Airtek Ontario Inc. Nous apprécions votre
          confiance dans nos produits et services, et nous restons engagés à
          vous fournir la meilleure expérience client possible.
        </p>
      </div>
    </div>
  );
}

export default page;
