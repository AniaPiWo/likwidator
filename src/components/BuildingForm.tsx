"use client";
import React, { useState } from "react";
import { DrawingCanvas } from "./DrawingCanvas";

interface FormData {
  dataSporzadzeniaProtokolu: string;
  numerSzkody: string;
  budynekTyp: string;
  wymiaryDlSzer: string;
  wymiaryWys: string;
  rokBudowy: string;
  liczbaKondygnacji: string;
  podpiwniczenie: boolean;
  dachMaterialKonstrukcyjny: string;
  dachMaterialUszkodzony: boolean;
  dachTermoizolacja: boolean;
  dachTermoizolacjaOpis: string;
  dachWykonczenie: string;
  dachOstatniRemont: string;
  dachUszkodzenia: string;
  elewacjaMaterial: string;
  elewacjaMaterialUszkodzony: boolean;
  elewacjaWykonczenie: string;
  elewacjaTermoizolacja: boolean;
  elewacjaTermoizolacjaOpis: string;
  elewacjaRodzajSciany: string;
  elewacjaOstatniRemont: string;
  elewacjaUszkodzenia: string;
}

export const BuildingForm: React.FC = () => {
  const todayDate = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<FormData>({
    dataSporzadzeniaProtokolu: todayDate,
    numerSzkody: "",
    budynekTyp: "",
    wymiaryDlSzer: "",
    wymiaryWys: "",
    rokBudowy: "",
    liczbaKondygnacji: "",
    podpiwniczenie: false,
    dachMaterialKonstrukcyjny: "",
    dachMaterialUszkodzony: false,
    dachTermoizolacja: false,
    dachTermoizolacjaOpis: "",
    dachWykonczenie: "",
    dachOstatniRemont: "",
    dachUszkodzenia: "",
    elewacjaMaterial: "",
    elewacjaMaterialUszkodzony: false,
    elewacjaWykonczenie: "",
    elewacjaTermoizolacja: false,
    elewacjaTermoizolacjaOpis: "",
    elewacjaRodzajSciany: "",
    elewacjaOstatniRemont: "",
    elewacjaUszkodzenia: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === "radio") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <h2 className="text-2xl font-bold">Załącznik do protokołu szkody</h2>
      <p>Dotyczy szkody na nieruchomości</p>
      <form className="m-4 w-full border" onSubmit={handleSubmit}>
        <div className="form-control flex flex-row w-full border-b p-4 gap-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Data sporządzenia protokołu: </span>
            </label>
            <input
              type="date"
              placeholder="Wpisz typ budynku"
              className="input input-bordered w-full"
              name="dataSporzadzeniaProtokolu"
              value={formData.dataSporzadzeniaProtokolu}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Szkoda nr:</span>
            </label>
            <input
              type="text"
              placeholder="Wpisz numer szkody"
              className="input input-bordered w-full"
              name="numerSzkody"
              value={formData.numerSzkody}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 space-y-4 border-b p-4 pt-0">
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Wymiary:</span>
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Długość x szerokość"
                className="input input-bordered w-full"
                name="wymiaryDlSzer"
                value={formData.wymiaryDlSzer}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Wysokość"
                className="input input-bordered w-full"
                name="wymiaryWys"
                value={formData.wymiaryWys}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Rok budowy:</span>
            </label>
            <input
              type="number"
              placeholder="Podaj rok budowy"
              className="input input-bordered w-full"
              name="rokBudowy"
              value={formData.rokBudowy}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Liczba kondygnacji:</span>
            </label>
            <input
              type="text"
              placeholder="Podaj liczbę kondygnacji"
              className="input input-bordered w-full"
              name="liczbaKondygnacji"
              value={formData.liczbaKondygnacji}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Podpiwniczenie:</span>
            </label>

            <div className="flex items-center space-x-4 mt-3">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="podpiwniczenie"
                  value="true"
                  className="radio radio-primary"
                  checked={formData.podpiwniczenie === true}
                  onChange={handleInputChange}
                />
                <span>Tak</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="podpiwniczenie"
                  value="false"
                  className="radio radio-primary"
                  checked={formData.podpiwniczenie === false}
                  onChange={handleInputChange}
                />
                <span>Nie</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="border-r w-full md:w-32 font-semibold bg-neutral border-b p-4">
            <p>Szkic budynku</p>
          </div>
          <div className="w-full flex flex-col items-center border-b p-4">
            <DrawingCanvas />
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="border-r w-full md:w-32 font-semibold bg-neutral border-b p-4">
            Dach
          </div>
          <div className="w-full">
            <div className="form-control border-b p-4">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-full md:w-1/2">
                  <label className="label">
                    <span className="label-text">Materiał konstrukcyjny:</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Podaj materiał konstrukcyjny"
                    className="input input-bordered w-full"
                    name="dachMaterialKonstrukcyjny"
                    value={formData.dachMaterialKonstrukcyjny}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label className="label">
                    <span className="label-text">Uszkodzony?</span>
                  </label>
                  <div className="flex items-center space-x-4 mt-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="dachMaterialUszkodzony"
                        value="true"
                        className="radio radio-primary"
                        checked={formData.dachMaterialUszkodzony === true}
                        onChange={handleInputChange}
                      />
                      <span>Tak</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="dachMaterialUszkodzony"
                        value="false"
                        className="radio radio-primary"
                        checked={formData.dachMaterialUszkodzony === false}
                        onChange={handleInputChange}
                      />
                      <span>Nie</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-control border-b p-4">
              <label className="label">
                <span className="label-text">Wykończenie:</span>
              </label>
              <input
                type="text"
                placeholder="Podaj rodzaj wykończenia"
                className="input input-bordered w-full"
                name="dachWykonczenie"
                value={formData.dachWykonczenie}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-control border-b p-4">
              <label className="label">
                <span className="label-text">Termoizolacja:</span>
              </label>

              <div className="flex  items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="dachTermoizolacja"
                    value="true"
                    className="radio radio-primary"
                    checked={formData.dachTermoizolacja === true}
                    onChange={handleInputChange}
                  />
                  <span>Tak</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="dachTermoizolacja"
                    value="false"
                    className="radio radio-primary"
                    checked={formData.dachTermoizolacja === false}
                    onChange={handleInputChange}
                  />
                  <span>Nie</span>
                </label>

                <input
                  type="text"
                  placeholder="Podaj rodzaj termoizolacji"
                  className="input input-bordered w-full mt-4 md:mt-0"
                  name="dachTermoizolacjaOpis"
                  value={formData.dachTermoizolacjaOpis}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-control border-b p-4">
              <label className="label">
                <span className="label-text">
                  Data ostatniego remontu (rok/miesiąc):
                </span>
              </label>
              <input
                type="text"
                placeholder="Podaj datę ostatniego remontu"
                className="input input-bordered w-full"
                name="dachOstatniRemont"
                value={formData.dachOstatniRemont}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-control border-b p-4">
              <label className="label">
                <span className="label-text">Uszkodzenia:</span>
              </label>
              <input
                type="text"
                placeholder="Podaj informacje o uszkodzeniach"
                className="input input-bordered w-full"
                name="dachUszkodzenia"
                value={formData.dachUszkodzenia}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="border-r w-full md:w-32 font-semibold bg-neutral p-4">
            Elewacja
          </div>
          <div className="w-full">
            <div className="form-control border-b p-4">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-full md:w-1/2">
                  <label className="label">
                    <span className="label-text">Materiał:</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Podaj materiał elewacji"
                    className="input input-bordered w-full"
                    name="elewacjaMaterial"
                    value={formData.elewacjaMaterial}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label className="label">
                    <span className="label-text">Uszkodzony?</span>
                  </label>
                  <div className="flex items-center space-x-4 mt-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="elewacjaMaterialUszkodzony"
                        value="true"
                        className="radio radio-primary"
                        checked={formData.elewacjaMaterialUszkodzony === true}
                        onChange={handleInputChange}
                      />
                      <span>Tak</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="elewacjaMaterialUszkodzony"
                        value="false"
                        className="radio radio-primary"
                        checked={formData.elewacjaMaterialUszkodzony === false}
                        onChange={handleInputChange}
                      />
                      <span>Nie</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-control border-b p-4">
              <label className="label">
                <span className="label-text">Wykończenie:</span>
              </label>
              <input
                type="text"
                placeholder="Podaj rodzaj wykończenia elewacji"
                className="input input-bordered w-full"
                name="elewacjaWykonczenie"
                value={formData.elewacjaWykonczenie}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-control border-b p-4">
              <label className="label">
                <span className="label-text">Termoizolacja:</span>
              </label>

              <div className="flex  md:flex-row items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="elewacjaTermoizolacja"
                    value="true"
                    className="radio radio-primary"
                    checked={formData.elewacjaTermoizolacja === true}
                    onChange={handleInputChange}
                  />
                  <span>Tak</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="elewacjaTermoizolacja"
                    value="false"
                    className="radio radio-primary"
                    checked={formData.elewacjaTermoizolacja === false}
                    onChange={handleInputChange}
                  />
                  <span>Nie</span>
                </label>

                <input
                  type="text"
                  placeholder="Podaj rodzaj termoizolacji"
                  className="input input-bordered w-full mt-4 md:mt-0"
                  name="elewacjaTermoizolacjaOpis"
                  value={formData.elewacjaTermoizolacjaOpis}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-control border-b p-4">
              <label className="label">
                <span className="label-text">Rodzaj ściany:</span>
              </label>
              <input
                type="text"
                placeholder="Podaj rodzaj ściany"
                className="input input-bordered w-full"
                name="elewacjaRodzajSciany"
                value={formData.elewacjaRodzajSciany}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-control border-b p-4">
              <label className="label">
                <span className="label-text">
                  Data ostatniego remontu (rok/miesiąc):
                </span>
              </label>
              <input
                type="text"
                placeholder="Podaj datę ostatniego remontu"
                className="input input-bordered w-full"
                name="elewacjaOstatniRemont"
                value={formData.elewacjaOstatniRemont}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-control p-4">
              <label className="label">
                <span className="label-text">Uszkodzenia:</span>
              </label>
              <input
                type="text"
                placeholder="Podaj informacje o uszkodzeniach"
                className="input input-bordered w-full"
                name="elewacjaUszkodzenia"
                value={formData.elewacjaUszkodzenia}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </form>
      <button
        type="submit"
        onClick={handleSubmit}
        className="btn btn-primary w-full"
      >
        zapisz formularz
      </button>
    </div>
  );
};
