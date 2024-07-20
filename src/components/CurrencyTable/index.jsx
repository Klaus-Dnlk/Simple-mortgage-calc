import React, { useState, useEffect } from "react";
import { getRates } from "../../service";

const CurrencyTable = () => {
    const [rates, setRates] = useState(null)

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const data = await getRates();
                setRates(data)
            } catch (error) {
                console.error("Noe currency found: ", error)
            }
        }
        fetchRates()
    }, [])  

    return (
        <div>
            <h2>Currency course</h2>
            {rates ? (
                <div>
                    <p>USD course: {rates.rates.UAH}</p>
                </div>
            ) : (
                <div>Loading</div>
            )}
        </div>
    )
}

export default CurrencyTable;