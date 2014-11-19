
(ns flow.components
  (:require [reagent.core :as r]
            [goog.events :as events]
            [flow.geometry :refer [x y dist] :as g])
  (:import [goog.events EventType]))

(def point-defaults
  {:stroke "white"
   :stroke-width 2
   :fill "rgb(200,25,25)"
   :r 5})

(def circle-defaults
  {:fill "rgba(230,35,35,.9)"
   :stroke "rgb(200,25,25)"
   :stroke-width 2})

(defn drag-move-fn [on-drag]
  (fn [evt]
    (on-drag (.-clientX evt) (.-clientY evt))))

(defn drag-end-fn [drag-move drag-end]
  (fn [evt]
    (events/unlisten js/window EventType.MOUSEMOVE drag-move)
    (events/unlisten js/window EventType.MOUSEUP @drag-end)))

(defn dragging [on-drag]
  (let [drag-move (drag-move-fn on-drag)
        drag-end-atom (atom nil)
        drag-end (drag-end-fn drag-move drag-end-atom)]
    (reset! drag-end-atom drag-end)
    (events/listen js/window EventType.MOUSEMOVE drag-move)
    (events/listen js/window EventType.MOUSEUP drag-end)))

(defn point [{:keys [on-drag]} p]
  [:circle 
   (merge point-defaults
          {:on-mouse-down #(dragging on-drag)
           :cx (x p)
           :cy (y p)})])

(defn circle [c r]
  [:circle
   (merge circle-defaults
          {:cx (x c)
           :cy (y c)
           :r (dist c r)})])

