import { useState, useEffect } from "react";
import "./App.css";

function App() {
    const [isValid, setIsValid] = useState(false);
    const [guide, setGuide] = useState("");
    const [data, setData] = useState(null); // Состояние для хранения данных

    // Функция для валидации GUID
    const validateGUID = (input) => {
        const guidPattern = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;
        return guidPattern.test(input);
    };

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setGuide(inputValue);

        setIsValid(validateGUID(inputValue));
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`https://testapi.cenergo.by/api/XLabEquipmentPublic/GetXLabEquipmentInfo(id=${guide})`);
            if (response.ok) {
                const responseData = await response.json();
                setData(responseData);
            } else {
                console.error("HTTP Error:", response.status);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };

    useEffect(() => {
        if (isValid) {
            fetchData();
        } else {
            setData(null);
        }
    }, [isValid]);

    return (
        <>
            <input type="text" value={guide} onChange={handleInputChange} />
            <p>{isValid ? "Valid GUID" : "Invalid GUID"}</p>

            {data && (
                <div>
                    <h2>Data:</h2>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </>
    );
}

export default App;
