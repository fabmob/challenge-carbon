const App = () => {
    return (
        <div className="main">
            <section className="hero is-primary">
                <div className="hero-body">
                    <p className="title">
                        Challenge #CarbonDetox
                    </p>
                    <p className="subtitle">
                        Les étapes pour répliquer le challenge
                    </p>
                </div>
            </section>
            <section className="section">
                <div className="content">
                    <h1>Déroulé d'un challenge</h1>
                    Le challenge se déroule sur un mois, avec une semaine de préparation et trois semaines de récolte de données.
                    <ol>
                        <li><b>[Début de la préparation (1 semaine)]</b> Identification des participants</li>
                            <ul>
                                <li>Définir deux équipes</li>
                                <li>Un minimum de 3 personnes par équipe est nécessaire pour l’anonymat des données</li>
                            </ul>
                        <li>Inscription des participants au formulaire self data de La Rochelle (le financeur de Tracemob et responsable des données)</li>
                            <ul>
                                <li><a href="https://framaforms.org/experimentation-self-data-territorial-et-mobilites-durables-inscription-1613560399">https://framaforms.org/experimentation-self-data-territorial-et-mobilites-durables-inscription-1613560399</a></li>
                                <li>Le coach CO2 est optionnel pour le challenge</li>
                            </ul>
                        <li>Installation de Tracemob chez les participants
                            <ul>
                                <li>Prise en main par les participants à leur rythme</li>
                                <li>Assistance aux bugs de configurations si nécessaire</li>
                                <li>Vérification de la bonne détection des premiers trajets</li>
                            </ul>
                        </li>
                        <li>Signature du consentement à participer au challenge</li>
                            <ul><li>L’idée est d’autoriser la Fabrique des Mobilités à recevoir l’identifiant unique Tracemob des participants et de consolider les données personnelles des participants, sans les consulter finement</li></ul>
                        <li>Définition d’une date de début et d’une date de fin du challenge (3 semaines)</li>
                            <ul>
                                <li>La première semaine est la semaine étalon</li>
                                <li>La dernière semaine est la semaine d'amélioration</li>
                            </ul>
                        <li>Les participants transmettent à la Fabrique des Mobilités leurs identifiants uniques Tracemob</li>
                            <ul><li>Via email ou via formulaire (à définir)</li></ul>
                        <li><b>[Début du challenge (3 semaines)]</b></li>
                        <ul><li>La récolte est automatique et les données agrégées sont publiées au fil de l’eau (une fois par semaine)</li></ul>
                        <li>À la fin du challenge, les identifiants utilisateurs sont supprimés des registres de la Fabrique des Mobilités. Les données agrégées sont conservées</li>
                            <ul><li>L’équipe qui s’est le plus améliorée est déclarée vainqueur</li></ul>
                        <li>Les participants sont libres de continuer d’utiliser ou non Tracemob (et le coach CO2 de Cozy Cloud).</li>

                    </ol>
                    <figure className="image">
                        <img style={{maxWidth: "1000px"}} src="/repliquer_gantt.png"/>
                    </figure>
                    <h1>Prêt à démarrer ?</h1>
                    <p>Contactez le responsable du projet Tracemob à la Fabrique des Mobilités (en ce moment, c'est Alex)</p>
                </div>
            </section>
            <footer className="footer">
                <div className="content has-text-centered">
                    <p>
                        Plateforme crée par <a href="http://fabmob.io" target="_blank">La fabrique des mobilités</a>. 
                        <br/>
                        Code source disponible sur <a href="https://github.com/fabmob/challenge-carbon" target="_blank">Github</a>.
                    </p>
                </div>
            </footer>
        </div>
    )
}

const domContainer = document.getElementById('root');
ReactDOM.render(<App />, domContainer);
