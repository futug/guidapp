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

    const formatDateRange = (startDate, endDate) => {
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        const startFormatted = startDate && startDate !== "0001-01-01T00:00:00+00:00" ? new Date(startDate).toLocaleDateString("ru-RU", options) : null;

        const endFormatted = endDate && endDate !== "0001-01-01T00:00:00+00:00" ? new Date(endDate).toLocaleDateString("ru-RU", options) : null;

        if (startFormatted && endFormatted) {
            return `c ${startFormatted} по ${endFormatted}`;
        } else if (startFormatted) {
            return `c ${startFormatted}`;
        } else if (endFormatted) {
            return `по ${endFormatted}`;
        } else {
            return null;
        }
    };

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
                Показать все
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
                        <span>{formatDateRange(metro.metrologicDate, metro.nextMetrologicDate)}</span>
                        {isExpired(metro.nextMetrologicDate) && (
                            <span>
                                <span className="certificate__expired">Срок истек</span>
                            </span>
                        )}
                    </p>
                    {metro?.needMonitor === true ? (
                        <p className="certificate__row">
                            <span className="certificate__title">Актуальное</span>
                        </p>
                    ) : (
                        <p className="certificate__row">
                            <span className="certificate__title">Не актуальное</span>
                        </p>
                    )}

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
