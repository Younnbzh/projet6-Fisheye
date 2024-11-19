function photographerTemplate(data) {
    const { name, id, city, country, tagline, price, portrait } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        // conteneur image
        const span = document.createElement( 'span' );
        // image
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        // lien
        const link = document.createElement( 'a' );
        link.href = "photographer.html?id="+ id;
        // nom photographe
        const h2 = document.createElement( 'h2' );
        h2.textContent = name;
        // conteneur texte
        const div = document.createElement( 'div' );
        div.ariaLabel = "Informations photographe";
        // ville / pays
        const p1 = document.createElement( 'p' );
        p1.className = 'photographer_city';
        p1.textContent = city+', '+country;
        // tagline
        const p2 = document.createElement( 'p' );
        p2.className = 'photographer_tagline';
        p2.textContent = tagline;
        // price
        const p3 = document.createElement( 'p' );
        p3.className = 'photographer_price';
        p3.textContent = price+'€/jour';
        // ajout des éléments au dom
        article.appendChild(link);
        link.appendChild(span);
        span.appendChild(img);
        link.appendChild(h2);
        article.appendChild(div);
        div.appendChild(p1);
        div.appendChild(p2);
        div.appendChild(p3);
        return (article);
    }
    return { name, picture, getUserCardDOM }
}