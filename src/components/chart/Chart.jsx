import styles from './Chart.module.css'
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Chart({title, data, dataKey, grid}){
    return(
        <div className="Chart">
            <h3>{title}</h3>
            <ResponsiveContainer width="100%" aspect={4 / 1} >
                <LineChart data={data}>
                    <XAxis dataKey="name" stroke='#5550bd' />
                    <Line type="monotone" dataKey={dataKey} stroke="#5550bd" />
                    <Tooltip />
                    {grid && <CartesianGrid stroke='#e0dfdf' strokeDasharray="5 3" />}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}