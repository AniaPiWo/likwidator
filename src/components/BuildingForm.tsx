import React from "react";

type Props = {};

export const BuildingForm = (props: Props) => {
  return (
    <div className="flex min-h-screen flex-col items-center ">
      <h2 className="text-2xl font-bold">Załącznik do protokułu szkody</h2>
      <p>dotyczy szkody na nieruchomości</p>
      <form className="m-4 w-full border">
        <div className="form-control w-full border-b p-4">
          <label className="label">
            <span className="label-text">Budynek, typ:</span>
          </label>
          <input
            type="text"
            placeholder="Wpisz typ budynku"
            className="input input-bordered w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-x-6 space-y-4 border-b p-4 pt-0">
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Wymiary:</span>
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Długość x szerokość"
                className="input input-bordered w-full"
              />
              <input
                type="text"
                placeholder="Wysokość"
                className="input input-bordered w-full"
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
                  value="tak"
                  className="radio radio-primary"
                />
                <span>Tak</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="podpiwniczenie"
                  value="nie"
                  className="radio radio-primary"
                />
                <span>Nie</span>
              </label>
            </div>
          </div>
        </div>

        <div className="border-b p-4">Szkic budynku</div>

        <div className="flex">
          <div className="border-r w-32 font-semibold border-b p-4">Dach</div>
          <div className="w-full">
            <div className="form-control border-b p-4">
              <div className="flex items-start gap-6">
                <div className="w-1/2">
                  <label className="label">
                    <span className="label-text">Materiał konstrukcyjny:</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Podaj materiał konstrukcyjny"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="w-1/2">
                  <label className="label">
                    <span className="label-text">Uszkodzony?</span>
                  </label>
                  <div className="flex items-center space-x-4 mt-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="uszkodzony"
                        value="tak"
                        className="radio radio-primary"
                      />
                      <span>Tak</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="uszkodzony"
                        value="nie"
                        className="radio radio-primary"
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
              />
            </div>

            <div className="form-control border-b p-4">
              <label className="label">
                <span className="label-text">Termoizolacja:</span>
              </label>

              <div className="flex items-center space-x-4 ">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="termoizolacja"
                    value="tak"
                    className="radio radio-primary"
                  />
                  <span>Tak</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="termoizolacja"
                    value="nie"
                    className="radio radio-primary"
                  />
                  <span>Nie</span>
                </label>

                <input
                  type="text"
                  placeholder="Podaj rodzaj termoizolacji"
                  className="input input-bordered w-full"
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
              />
            </div>
          </div>
        </div>

        <div className="flex ">
          <div className="border-r w-32 font-semibold p-4">Elewacja</div>
          <div className="w-full">
            <div className="form-control border-b p-4">
              <div className="flex items-start gap-6">
                <div className="w-1/2">
                  <label className="label">
                    <span className="label-text">Materiał:</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Podaj materiał elewacji"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="w-1/2">
                  <label className="label">
                    <span className="label-text">Uszkodzony?</span>
                  </label>
                  <div className="flex items-center space-x-4 mt-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="elewacja-uszkodzony"
                        value="tak"
                        className="radio radio-primary"
                      />
                      <span>Tak</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="elewacja-uszkodzony"
                        value="nie"
                        className="radio radio-primary"
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
              />
            </div>

            <div className="form-control border-b p-4">
              <label className="label">
                <span className="label-text">Termoizolacja:</span>
              </label>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="elewacja-termoizolacja"
                    value="tak"
                    className="radio radio-primary"
                  />
                  <span>Tak</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="elewacja-termoizolacja"
                    value="nie"
                    className="radio radio-primary"
                  />
                  <span>Nie</span>
                </label>

                <input
                  type="text"
                  placeholder="Podaj rodzaj termoizolacji"
                  className="input input-bordered w-full"
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
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
