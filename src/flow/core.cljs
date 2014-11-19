
(ns flow.core
  (:require [reagent.core :as r]
            [secretary.core :as secretary :include-macros true :refer-macros [defroute]]
            [goog.events :as events]
            [goog.history.EventType :as EventType]
            [flow.components :as c]
            [flow.geometry :as g])
  (:import goog.History))

(enable-console-print!)

;; Swappable state

(def points
  (r/atom
   {:c (g/point 250 250)
    :p (g/point 250 300)}))

(defn move-point [svg-root p]
  (fn [x y]
    (let [bcr (-> svg-root
                  r/dom-node
                  .getBoundingClientRect)]
      (swap! points assoc p (g/point (- x (.-left bcr)) (- y (.-top bcr)))))))

;; Draw shapes

(defn root [svg-root]
  (let [{:keys [p c c2]} @points]
    [:g
     [c/circle p c] ; Circle
     [c/point {:on-drag (move-point svg-root :c)} c]    ; Movable center-point
     [c/point {:on-drag (move-point svg-root :p)} p]])) ; Movable point

;; Main reagent-component

(defn main [{:keys [width height]}]
  [:svg
   {:width (or width "100%")
    :height (or height "100%")}
   [root (r/current-component)]])

(defn by-id [id]
  (.getElementById js/document id))

;; Routes

(defroute home-path "/" []
  (r/render-component [main] (by-id "app")))

;; Dispatch!

(let [h (History.)]
  (goog.events/listen h EventType/NAVIGATE #(secretary/dispatch! (.-token %)))
  (doto h (.setEnabled true)))

