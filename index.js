const {BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer} = window.Recharts
const App = () => {
    const [data, setData] = React.useState()
    const [teamID, setTeamID] = React.useState(1)
    React.useEffect(() => {
        Papa.parse("data/co2perday.csv", {
            download: true,
            header: true,
            skipEmptyLines: 'greedy',
            complete: function(results) {
            	console.log(results);
                setData(results.data.map(res => {
                    res.gCo2PerPersonPerKm = (res.co2 * 1000 / 5 / res.distance).toFixed(2)
                    res.gCo2PerPersonPerKm2 = (res.co2 * 1000 / 5 / res.distance * 2).toFixed(2)
                    res.co22 = res.co2 *2
                    return res
                }))
            }
        })
    }, [])

    return (
        <div className="main">
            <section className="section">
                <div className="container">
                    <h1 className="title">
                        <button className="button is-primary" onClick={() => setTeamID(1)}>{'<'}</button> Challenge carbon, equipe {teamID} <button className="button is-primary" onClick={() => setTeamID(2)}>{'>'}</button>
                    </h1>
                    <p className="subtitle">
                        gCO2 / km / personne
                    </p>
                    <div>
                        <BarChart width={730} height={250} data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week"/>
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey={teamID === 1 ? "gCo2PerPersonPerKm" : "gCo2PerPersonPerKm2"} name="Mon équipe" fill="#82ca9d" />
                            <Bar dataKey={teamID === 2 ? "gCo2PerPersonPerKm" : "gCo2PerPersonPerKm2"} name="Autre équipe" fill="#8884d8" />
                        </BarChart>
                    </div>
                    <p className="subtitle">
                        Emissions de CO2
                    </p>
                    <div>
                        <BarChart width={730} height={250} data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week"/>
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey={teamID === 1 ? "co2" : "co22"} name="Mon équipe" fill="#82ca9d" />
                            <Bar dataKey={teamID === 2 ? "co2" : "co22"} name="Autre équipe" fill="#8884d8" />
                        </BarChart>
                    </div>
                </div>
            </section>
        </div>
    )
}

const domContainer = document.getElementById('root');
ReactDOM.render(<App />, domContainer);
