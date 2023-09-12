import React, { useState } from "react";
import "../App.css";

const Certificates = ({ metroData }) => {
    const [shownMetroData, setShownMetroData] = useState(5);
    const [sliceStart, setSliceStart] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterExpired, setFilterExpired] = useState(false);

    const filteredMetroData = !filterExpired ? metroData?.filter((metro) => metro.needMonitor === true) : metroData;

    const sliceInc = () => {
        setSliceStart(sliceStart + 5);
    };

    const showMore = () => {
        if (shownMetroData < metroData.length) {
            setShownMetroData(shownMetroData + 5);
            sliceInc();
        } else {
            setShownMetroData(5);
            setSliceStart(0);
        }
    };
    function formatDate(date) {
        if (date) {
            const options = { year: "numeric", month: "2-digit", day: "2-digit" };
            const formattedDate = new Date(date).toLocaleDateString("ru-RU", options);
            return formattedDate;
        }
        return "";
    }

    function isExpired(date) {
        if (date) {
            return new Date(date) < new Date();
        }
        return false;
    }

    console.log(metroData);
    console.log(filteredMetroData);

    return (
        <div className="equip__certificates">
            <label htmlFor="certificates__filter" className="certificates__filter">
                Все сертификаты
                <input type="checkbox" id="certificates__filter" checked={filterExpired} onChange={() => setFilterExpired(!filterExpired)} />
                <span className="checkbox"></span>
            </label>
            <hr />
            {filteredMetroData?.slice(0, shownMetroData).map((metro) => (
                <div key={metro.id}>
                    <p className="certificate__row">
                        <span className="certificate__title">{metro.metrologicDocumentTitle}</span>
                    </p>
                    <p className="certificate__row">
                        <span className="certificate__title">Номер документа:</span>
                        {metro.metrologicDocumentNum}
                    </p>
                    <p className="certificate__row">
                        <span className="certificate__title">Срок действия:</span>
                        {metro.metrologicDate && metro.nextMetrologicDate ? (
                            <span>
                                с {formatDate(metro.metrologicDate)} по {formatDate(metro?.nextMetrologicDate)}
                            </span>
                        ) : metro.metrologicDate ? (
                            <span>с {formatDate(metro.metrologicDate)}</span>
                        ) : metro.nextMetrologicDate ? (
                            <span>по {formatDate(metro.nextMetrologicDate)}</span>
                        ) : null}
                        {isExpired(metro.nextMetrologicDate) && (
                            <span>
                                <span className="certificate__expired">Срок истек</span>
                            </span>
                        )}
                    </p>
                    <p className="certificate__row">
                        <span className="certificate__title">Исполнитель:</span>
                        {metro.metrologicOrganisationTitle ? metro.metrologicOrganisationTitle : "Не указан"}
                    </p>
                    <hr />
                </div>
            ))}
            <div className="cerificate__footer">
                {filteredMetroData?.length > 5 && (
                    <button className="equip__certificates-more" onClick={showMore}>
                        {shownMetroData < metroData?.length ? "Показать еще" : "Скрыть"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Certificates;
